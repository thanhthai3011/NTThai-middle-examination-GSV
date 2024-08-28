import { Request, Response } from "express";
import { BaseController } from "../../../../core/infra/BaseController";
import { GetDeviceById } from "./get_device_by_id.usecase";

export class GetDeviceByIdController extends BaseController {
    private useCase: GetDeviceById;

    constructor(useCase: GetDeviceById) {
        super();
        this.useCase = useCase;
    }
    async executeImpl(req: Request, res: Response): Promise<any> {
        const result = await this.useCase.execute(req);
        if (result.isRight()) {
            const device = result.value.getValue();
            return this.ok<any>(res, device);
        }
        const { message } = result.value.getErrorValue();
        return this.clientError(res, message);
    }
}
