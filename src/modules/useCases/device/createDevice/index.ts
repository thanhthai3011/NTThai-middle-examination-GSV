import { deviceRepo, locationRepo } from "../../../repos/index.repo";
import { CreateDeviceController } from "./create_device.controller";
import { CreateDevice } from "./create_device.usecase";

const createDeviceController = new CreateDeviceController(new CreateDevice(deviceRepo, locationRepo));

export { createDeviceController };
