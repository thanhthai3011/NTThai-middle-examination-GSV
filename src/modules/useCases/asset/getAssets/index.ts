import { assetRepo } from "../../../repos/index.repo";
import { GetAssetPagesController } from "./get_assets.controller";
import { GetAssetPages } from "./get_assets.usecase";

const getAssetPagesController = new GetAssetPagesController(new GetAssetPages(assetRepo));

export { getAssetPagesController };
