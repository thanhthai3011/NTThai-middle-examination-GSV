import { Request, Response } from "express";
import { BaseController } from "../../../../core/infra/BaseController";
import { CreateAsset } from "./create_asset.usecase";

export class CreateAssetController extends BaseController {
    private useCase: CreateAsset;

    constructor(useCase: CreateAsset) {
        super();
        this.useCase = useCase;
    }
    async executeImpl(req: Request, res: Response): Promise<any> {
        const result = await this.useCase.execute(req);
        if (result?.isRight()) {
            const asset = result.value.getValue();
            return this.ok<any>(res, asset);
        }
        const { message } = result.value.getErrorValue();
        return this.clientError(res, message);
    }
}
