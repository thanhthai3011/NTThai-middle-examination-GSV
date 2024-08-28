import { locationRepo } from "../../../repos/index.repo";
import { GetLocationPagesController } from "./get_locations.controller";
import { GetLocationPages } from "./get_locations.usecase";

const getLocationPagesController = new GetLocationPagesController(new GetLocationPages(locationRepo));

export { getLocationPagesController };
