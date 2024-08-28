import { Request, Response } from "express";
import { BaseController } from "../../../../core/infra/BaseController";
import { GetLocationById } from "./get_location_by_id.usecase";

export class GetLocationByIdController extends BaseController {
    private useCase: GetLocationById;

    constructor(useCase: GetLocationById) {
        super();
        this.useCase = useCase;
    }
    async executeImpl(req: Request, res: Response): Promise<any> {
        const result = await this.useCase.execute(req);
        if (result.isRight()) {
            const location = result.value.getValue();
            return this.ok<any>(res, location);
        }
        const { message } = result.value.getErrorValue();
        return this.clientError(res, message);
    }
}
