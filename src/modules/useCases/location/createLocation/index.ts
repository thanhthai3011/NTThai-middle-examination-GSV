import { locationRepo, organizationRepo } from "../../../repos/index.repo";
import { CreateLocationController } from "./create_location.controller";
import { CreateLocation } from "./create_location.usecase";

const createLocationController = new CreateLocationController(new CreateLocation(locationRepo, organizationRepo));

export { createLocationController };
