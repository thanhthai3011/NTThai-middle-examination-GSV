import models from "../../infra/sequelize/models";
import { OrganizationRepo } from "./organization.repo";
import { AssetRepo } from "./asset.repo";
import { LocationRepo } from "./location.repo";
import { DeviceRepo } from "./device.repo";

const organizationRepo = new OrganizationRepo(models);
const assetRepo = new AssetRepo(models);
const locationRepo = new LocationRepo(models);
const deviceRepo = new DeviceRepo(models);

export { organizationRepo, assetRepo, locationRepo, deviceRepo };
