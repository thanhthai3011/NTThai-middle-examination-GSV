import { Request, Response } from "express";
import { BaseController } from "../../../../core/infra/BaseController";
import { GetAssetPages } from "./get_assets.usecase";

export class GetAssetPagesController extends BaseController {
    private useCase: GetAssetPages;

    constructor(useCase: GetAssetPages) {
        super();
        this.useCase = useCase;
    }
    async executeImpl(req: Request, res: Response): Promise<any> {
        const result = await this.useCase.execute(req, res);
        if (result.isRight()) {
            const assets: Array<any> = await result.value.getValue();
            return this.ok(res, assets);
        }
        const { message } = result.value.getErrorValue();
        return this.clientError(res, message);
    }
}
