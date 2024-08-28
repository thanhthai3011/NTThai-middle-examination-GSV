import { organizationRepo } from "../../../repos/index.repo";
import { GetOrganizationPagesController } from "./get_organizations.controller";
import { GetOrganizationPages } from "./get_organizations.usecase";

const getOrganizationPagesController = new GetOrganizationPagesController(new GetOrganizationPages(organizationRepo));

export { getOrganizationPagesController };
