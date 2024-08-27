import { benefitTypeRepo, benefitRepo, voucherDefinitionRepo, loyaltyPromotionRepo } from "../../../repos/index.repo";
import { CreateBenefitController } from "./create_benefit.controller";
import { CreateBenefit } from "./create_benefit.usecase";

const createBenefitController = new CreateBenefitController(new CreateBenefit(benefitRepo, benefitTypeRepo, voucherDefinitionRepo, loyaltyPromotionRepo));

export { createBenefitController };
