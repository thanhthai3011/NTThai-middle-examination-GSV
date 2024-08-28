import { organizationRepo } from "../../../repos/index.repo";
import { CreateOrganizationController } from "./create_organization.controller";
import { CreateOrganization } from "./create_organization.usecase";

const createOrganizationController = new CreateOrganizationController(
  new CreateOrganization(organizationRepo)
);

export { createOrganizationController };
