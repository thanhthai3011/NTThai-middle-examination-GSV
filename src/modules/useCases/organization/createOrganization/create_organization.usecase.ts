import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, right, Result, left } from "../../../../core/logic/Result";
import Logger from "../../../../utils/logger";
import { Benefit } from "../../../domain/benefit/benefit.domain";
import { BenefitMap } from "../../../mappers/benefit.map";
import { BenefitBodyDTO, BenefitDTO } from "../../../dtos/benefit.dto";
import { IBenefitRepo } from "../../../repos/interface/benefit.interface";
import { UseCaseError } from "../../../../core/logic/UseCaseError";
import { CommonErrors } from "../../../errors/common.errors";
import { Name } from "../../../domain/valueObject/common/name";
import { ID } from "../../../domain/valueObject/common/id";
import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";
import { IBenefitTypeRepo } from "../../../repos/interface/benefit_type.interface";
import { IVoucherDefinitionRepo } from "../../../repos/interface/voucher_definition.interface";
import { BenefitStatuses } from "../../../../infra/sequelize/config/enum";
import { ILoyaltyPromotionRepo } from "../../../repos/interface/loyalty_promotion.interface";

type Response = Either<GenericAppError.UnexpectedError, any>;

export class CreateBenefit implements UseCase<any, Response> {
    private readonly _benefitRepo: IBenefitRepo;
    private readonly _benefitTypeRepo: IBenefitTypeRepo;
    private readonly _voucherDefinitionRepo: IVoucherDefinitionRepo;
    private readonly _loyaltyPromotionRepo: ILoyaltyPromotionRepo;

    constructor(
        benefitRepo: IBenefitRepo,
        benefitTypeRepo: IBenefitTypeRepo,
        voucherDefinitionRepo: IVoucherDefinitionRepo,
        loyaltyPromotionRepo: ILoyaltyPromotionRepo,
    ) {
        this._benefitRepo = benefitRepo;
        this._benefitTypeRepo = benefitTypeRepo;
        this._voucherDefinitionRepo = voucherDefinitionRepo;
        this._loyaltyPromotionRepo = loyaltyPromotionRepo;
    }

    async handleBenefitTypeOrError(benefitTypeId: string): Promise<any | Result<UseCaseError>> {
        const benefitTypeOrError = await this._benefitTypeRepo.findById(benefitTypeId);
        Logger.info(`Benefit Type ${JSON.stringify(benefitTypeOrError)}`);
        if (!benefitTypeOrError) return new CommonErrors.NotFound("Benefit type");
        return benefitTypeOrError;
    }

    async handleVoucherDefinitionOrError(voucherDefinitionId: string): Promise<any | Result<UseCaseError>> {
        const voucherDefinitionOrError = await this._voucherDefinitionRepo.findById(voucherDefinitionId);
        Logger.info(`Voucher Definition ${JSON.stringify(voucherDefinitionOrError)}`);
        if (!voucherDefinitionOrError) return new CommonErrors.NotFound("Voucher definition");
        return voucherDefinitionOrError;
    }

    async handleLoyaltyPromotionOrError(loyaltyPromotionId: string): Promise<any | Result<UseCaseError>> {
        const loyaltyPromotionOrError = await this._loyaltyPromotionRepo.findById(loyaltyPromotionId);
        Logger.info(`Loyalty promotion ${JSON.stringify(loyaltyPromotionOrError)}`);
        if (!loyaltyPromotionOrError) return new CommonErrors.NotFound("Loyalty promotion");
        return loyaltyPromotionOrError;
    }

    public async execute(req): Promise<any> {
        Logger.info(`BEGIN >> Benefit: ${JSON.stringify(req.body)}`);
        const benefitBody: BenefitBodyDTO = { ...req.body };

        const nameOrError: Result<Name> = Name.create({ value: benefitBody.name });
        if (nameOrError.isFailure) {
            return left(nameOrError);
        }

        const benefitTypeOrError: Result<ID> = ID.create(new UniqueEntityID(benefitBody.benefit_type_id), "Benefit type id");
        if (benefitTypeOrError.isFailure) {
            return left(benefitTypeOrError);
        }
        const checkExistBenefitType: any | Result<UseCaseError> = await this.handleBenefitTypeOrError(benefitBody.benefit_type_id);
        if (checkExistBenefitType["isFailure"]) {
            return left(checkExistBenefitType);
        }

        if (benefitBody.voucher_definition_id) {
            const checkExistVoucherDefinition: any | Result<UseCaseError> = await this.handleVoucherDefinitionOrError(benefitBody.voucher_definition_id);
            if (checkExistVoucherDefinition["isFailure"]) {
                return left(checkExistVoucherDefinition);
            }
        }

        if (benefitBody.loyalty_promotion_id) {
            const checkExistVoucherDefinition: any | Result<UseCaseError> = await this.handleLoyaltyPromotionOrError(benefitBody.loyalty_promotion_id);
            if (checkExistVoucherDefinition["isFailure"]) {
                return left(checkExistVoucherDefinition);
            }
        }

        benefitBody.status = BenefitStatuses.Activated;

        const result: Benefit = await this._benefitRepo.create(benefitBody);
        Logger.info(`END << Benefit Type: ${JSON.stringify(result)}`);

        const benefitDTO: BenefitDTO = BenefitMap.toDTO(result);

        return right(Result.ok(benefitDTO));
    }
}
