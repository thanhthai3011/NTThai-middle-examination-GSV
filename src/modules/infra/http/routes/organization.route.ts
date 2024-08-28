import express from "express";

import { createOrganizationController } from "../../../useCases/organization/createOrganization";
import { getOrganizationByIdController } from "../../../useCases/organization/getOrganizationById";
import { getOrganizationPagesController } from "../../../useCases/organization/getOrganizations";

const organizationRoute = express.Router();

organizationRoute.post("/organization", (req, res) =>
  createOrganizationController.execute(req, res)
);

organizationRoute.get("/organization/:id", (req, res) =>
  getOrganizationByIdController.execute(req, res)
);

organizationRoute.get("/organization", (req, res) =>
  getOrganizationPagesController.execute(req, res)
);

export { organizationRoute };
