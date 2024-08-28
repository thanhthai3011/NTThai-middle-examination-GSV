import { Request, Response } from "express";
import { BaseController } from "../../../../core/infra/BaseController";
import { GetAssetById } from "./get_asset_by_id.usecase";

export class GetAssetByIdController extends BaseController {
    private useCase: GetAssetById;

    constructor(useCase: GetAssetById) {
        super();
        this.useCase = useCase;
    }
    async executeImpl(req: Request, res: Response): Promise<any> {
        const result = await this.useCase.execute(req);
        if (result.isRight()) {
            const asset = result.value.getValue();
            return this.ok<any>(res, asset);
        }
        const { message } = result.value.getErrorValue();
        return this.clientError(res, message);
    }
}
