import { locationRepo } from "../../../repos/index.repo";
import { GetLocationByIdController } from "./get_location_by_id.controller";
import { GetLocationById } from "./get_location_by_id.usecase";

const getLocationByIdController = new GetLocationByIdController(new GetLocationById(locationRepo));

export { getLocationByIdController };
