import { Request, Response } from "express";
import { BaseController } from "../../../../core/infra/BaseController";
import { CreateDevice } from "./create_device.usecase";

export class CreateDeviceController extends BaseController {
    private useCase: CreateDevice;

    constructor(useCase: CreateDevice) {
        super();
        this.useCase = useCase;
    }
    async executeImpl(req: Request, res: Response): Promise<any> {
        const result = await this.useCase.execute(req);
        if (result?.isRight()) {
            const device = result.value.getValue();
            return this.ok<any>(res, device);
        }
        const { message } = result.value.getErrorValue();
        return this.clientError(res, message);
    }
}
