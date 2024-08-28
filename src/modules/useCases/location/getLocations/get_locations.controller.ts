import { Request, Response } from "express";
import { BaseController } from "../../../../core/infra/BaseController";
import { GetLocationPages } from "./get_locations.usecase";

export class GetLocationPagesController extends BaseController {
    private useCase: GetLocationPages;

    constructor(useCase: GetLocationPages) {
        super();
        this.useCase = useCase;
    }
    async executeImpl(req: Request, res: Response): Promise<any> {
        const result = await this.useCase.execute(req, res);
        if (result.isRight()) {
            const locations: Array<any> = await result.value.getValue();
            return this.ok(res, locations);
        }
        const { message } = result.value.getErrorValue();
        return this.clientError(res, message);
    }
}
