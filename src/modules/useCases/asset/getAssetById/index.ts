import { assetRepo } from "../../../repos/index.repo";
import { GetAssetByIdController } from "./get_asset_by_id.controller";
import { GetAssetById } from "./get_asset_by_id.usecase";

const getAssetByIdController = new GetAssetByIdController(new GetAssetById(assetRepo));

export { getAssetByIdController };
