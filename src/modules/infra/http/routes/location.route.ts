import express from "express";

import { createLocationController } from "../../../useCases/location/createLocation";
import { getLocationByIdController } from "../../../useCases/location/getLocationById";
import { getLocationPagesController } from "../../../useCases/location/getLocations";

const locationRoute = express.Router();

locationRoute.post("/location", (req, res) =>
  createLocationController.execute(req, res)
);

locationRoute.get("/location/:id", (req, res) =>
  getLocationByIdController.execute(req, res)
);

locationRoute.get("/location", (req, res) =>
  getLocationPagesController.execute(req, res)
);

export { locationRoute };
