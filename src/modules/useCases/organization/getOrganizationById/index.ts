import { benefitRepo } from "../../../repos/index.repo";
import { GetBenefitByIdController } from "./get_organization_by_id.controller";
import { GetBenefitById } from "./get_organization_by_id.usecase";

const getBenefitByIdController = new GetBenefitByIdController(new GetBenefitById(benefitRepo));

export { getBenefitByIdController };
