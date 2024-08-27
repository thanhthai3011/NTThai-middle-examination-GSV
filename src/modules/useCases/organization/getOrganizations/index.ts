import { benefitRepo } from "../../../repos/index.repo";
import { GetBenefitPagesController } from "./get_benefits.controller";
import { GetBenefitPages } from "./get_benefits.usecase";

const getBenefitPagesController = new GetBenefitPagesController(new GetBenefitPages(benefitRepo));

export { getBenefitPagesController };
