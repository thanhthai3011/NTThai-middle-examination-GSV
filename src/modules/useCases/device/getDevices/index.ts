import { deviceRepo } from "../../../repos/index.repo";
import { GetDevicePagesController } from "./get_devices.controller";
import { GetDevicePages } from "./get_devices.usecase";

const getDevicePagesController = new GetDevicePagesController(new GetDevicePages(deviceRepo));

export { getDevicePagesController };
