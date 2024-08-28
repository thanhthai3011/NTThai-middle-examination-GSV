import { Request, Response } from "express";
import { BaseController } from "../../../../core/infra/BaseController";
import { CreateLocation } from "./create_location.usecase";

export class CreateLocationController extends BaseController {
    private useCase: CreateLocation;

    constructor(useCase: CreateLocation) {
        super();
        this.useCase = useCase;
    }
    async executeImpl(req: Request, res: Response): Promise<any> {
        const result = await this.useCase.execute(req);
        if (result?.isRight()) {
            const location = result.value.getValue();
            return this.ok<any>(res, location);
        }
        const { message } = result.value.getErrorValue();
        return this.clientError(res, message);
    }
}
