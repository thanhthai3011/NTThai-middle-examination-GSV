import { assetRepo, locationRepo } from "../../../repos/index.repo";
import { CreateAssetController } from "./create_asset.controller";
import { CreateAsset } from "./create_asset.usecase";

const createAssetController = new CreateAssetController(new CreateAsset(assetRepo, locationRepo));

export { createAssetController };
