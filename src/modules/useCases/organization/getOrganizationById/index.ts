import { organizationRepo } from "../../../repos/index.repo";
import { GetOrganizationByIdController } from "./get_organization_by_id.controller";
import { GetOrganizationById } from "./get_organization_by_id.usecase";

const getOrganizationByIdController = new GetOrganizationByIdController(
  new GetOrganizationById(organizationRepo)
);

export { getOrganizationByIdController };
