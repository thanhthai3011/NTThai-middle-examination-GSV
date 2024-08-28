import express from "express";

import { createAssetController } from "../../../useCases/asset/createAsset";
import { getAssetByIdController } from "../../../useCases/asset/getAssetById";
import { getAssetPagesController } from "../../../useCases/asset/getAssets";

const assetRoute = express.Router();

assetRoute.post("/asset", (req, res) =>
  createAssetController.execute(req, res)
);

assetRoute.get("/asset/:id", (req, res) =>
  getAssetByIdController.execute(req, res)
);

assetRoute.get("/asset", (req, res) =>
  getAssetPagesController.execute(req, res)
);

export { assetRoute };
