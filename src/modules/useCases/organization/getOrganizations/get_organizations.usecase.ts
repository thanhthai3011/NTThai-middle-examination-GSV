import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, left, Result, right } from "../../../../core/logic/Result";
import Logger from "../../../../utils/logger";
import { ApiFeatures } from "../../../../utils/api_features";
import { BenefitMap } from "../../../mappers/benefit.map";
import { IBenefitRepo } from "../../../repos/interface/benefit.interface";
import { BenefitBodyDTO } from "./get_organizations.dto";
import models from "../../../../infra/sequelize/models";
import { Op } from "sequelize";

type Response = Either<GenericAppError.UnexpectedError, any>;

class GetBenefitPages implements UseCase<any, Response> {
    private readonly _benefitRepo: IBenefitRepo;
    private readonly _prefixBenefit: string = "be";

    constructor(benefitRepo: IBenefitRepo) {
        this._benefitRepo = benefitRepo;
    }

    public async execute(req, res): Promise<any> {
        Logger.info(`BEGIN >> Query: ${JSON.stringify(req.query)}`);
        const query = { ...req.query };
        const queryObject = {
            status: query.status,
            search: query.search,
        };

        const conditions = {};
        const arrQueryObject = Object.entries(queryObject).map((item) => {
            return {
                key: item[0],
                value: item[1],
            };
        });

        for (let index = 0; index < arrQueryObject.length; index++) {
            switch (arrQueryObject[index].key) {
                case "status":
                    const status = typeof arrQueryObject[index].value === "string" ? [arrQueryObject[index].value] : arrQueryObject[index].value;
                    if (Array.isArray(status)) {
                        conditions["be_status"] = {
                            [Op.in]: status,
                        };
                    }
                    break;
                case "search":
                    const search = typeof arrQueryObject[index].value === "string" ? [arrQueryObject[index].value] : arrQueryObject[index].value;
                    if (Array.isArray(search)) {
                        conditions["be_search"] = {
                            [Op.substring]: search.map((s) =>
                                s
                                    .normalize("NFD")
                                    .replace(/[\u0300-\u036f]/g, "")
                                    .toLowerCase(),
                            ),
                        };
                    }
                    break;
                default:
                    break;
            }
        }
        const objQuery = new ApiFeatures(query)
            .filter(conditions)
            .sort(query.sort_field || "be_created_date", query.sort_order || "DESC", this._prefixBenefit)
            .limitFields(this._prefixBenefit)
            .paginate()
            .paranoid()
            .includes([
                {
                    model: models.BenefitType,
                    require: false,
                    as: "benefitType",
                    attributes: ["bt_name"],
                },
                {
                    model: models.VoucherDefinition,
                    require: false,
                    as: "voucherDefinition",
                    attributes: ["vd_name"],
                },
                {
                    model: models.LoyaltyPromotion,
                    require: false,
                    as: "loyaltyPromotion",
                    attributes: ["lpm_name"],
                }
            ])
            .getObjQuery();
        Logger.debug(`Query: ${JSON.stringify(objQuery)}`);

        const { count, rows }: any = await this._benefitRepo.findPages(objQuery);
        const benefits =
            rows.length > 0
                ? rows.map((benefit) => {
                      benefit["benefit_type_name"] = benefit?.["benefitType"]?.["bt_name"] ?? null;
                      benefit["voucher_definition_name"] = benefit?.["voucherDefinition"]?.["vd_name"] ?? null;
                      benefit["loyalty_promotion_name"] = benefit?.["loyaltyPromotion"]?.["lpm_name"] ?? null;
                      return BenefitMap.toDTO(benefit);
                  })
                : [];

        const result = {
            page: Number(query?.page) * 1,
            pageSize: Number(query?.page_size) * 1,
            totalItems: count || 0,
            benefits: benefits,
        };

        Logger.info(`END << Benefit Page ${JSON.stringify(result)}`);
        return right(Result.ok(result));
    }
}

export { GetBenefitPages };
