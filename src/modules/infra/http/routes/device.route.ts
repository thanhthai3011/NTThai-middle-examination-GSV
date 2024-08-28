import express from "express";

import { createDeviceController } from "../../../useCases/device/createDevice";
import { getDeviceByIdController } from "../../../useCases/device/getDeviceById";
import { getDevicePagesController } from "../../../useCases/device/getDevices";

const deviceRoute = express.Router();

deviceRoute.post("/device", (req, res) =>
  createDeviceController.execute(req, res)
);

deviceRoute.get("/device/:id", (req, res) =>
  getDeviceByIdController.execute(req, res)
);

deviceRoute.get("/device", (req, res) =>
  getDevicePagesController.execute(req, res)
);

export { deviceRoute };
