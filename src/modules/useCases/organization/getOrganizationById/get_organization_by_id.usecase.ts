import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, right, Result, left } from "../../../../core/logic/Result";
import Logger from "../../../../utils/logger";
import { Benefit } from "../../../domain/benefit/benefit.domain";
import { UseCaseError } from "../../../../core/logic/UseCaseError";
import { IBenefitRepo } from "../../../repos/interface/benefit.interface";
import { BenefitMap } from "../../../mappers/benefit.map";
import { BenefitDTO, BenefitIdDTO } from "../../../dtos/benefit.dto";
import { CommonErrors } from "../../../errors/common.errors";
import models from "../../../../infra/sequelize/models";

type Response = Either<GenericAppError.UnexpectedError, any>;

class GetBenefitById implements UseCase<any, Response> {
    private readonly _benefitRepo: IBenefitRepo;

    constructor(benefitRepo: IBenefitRepo) {
        this._benefitRepo = benefitRepo;
    }

    private async handleBenefitOrError(id: string): Promise<Benefit | Result<UseCaseError>> {
        const benefit = await this._benefitRepo.findOne({
            where: { be_id: id },
            paranoid: true,
            include: [
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
                    attributes: ["lpm_name"]
                }
            ],
        });
        if (!benefit) {
            return new CommonErrors.NotFound("Id");
        }
        return benefit;
    }

    public async execute(req): Promise<any> {
        Logger.info(`BEGIN >> Params ${JSON.stringify(req.params)}`);
        const { id }: BenefitIdDTO = { ...req.params };

        const benefitOrError: Benefit | Result<UseCaseError> = await this.handleBenefitOrError(id);
        if (benefitOrError["isFailure"]) {
            return left(benefitOrError);
        }

        Logger.info(`END << Result ${JSON.stringify(benefitOrError)}`);
        benefitOrError["benefit_type_name"] = benefitOrError?.["benefitType"]?.["bt_name"] ?? null;
        benefitOrError["voucher_definition_name"] = benefitOrError?.["voucherDefinition"]?.["vd_name"] ?? null;
        benefitOrError["loyalty_promotion_name"] = benefitOrError?.["loyaltyPromotion"]?.["lpm_name"] ?? null;
        const benefitDTO: BenefitDTO = BenefitMap.toDTO(benefitOrError as Benefit);

        return right(Result.ok(benefitDTO));
    }
}

export { GetBenefitById };
