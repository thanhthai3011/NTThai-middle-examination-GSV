import { deviceRepo } from "../../../repos/index.repo";
import { GetDeviceByIdController } from "./get_device_by_id.controller";
import { GetDeviceById } from "./get_device_by_id.usecase";

const getDeviceByIdController = new GetDeviceByIdController(new GetDeviceById(deviceRepo));

export { getDeviceByIdController };
