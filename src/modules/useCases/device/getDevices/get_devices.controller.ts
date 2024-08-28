import { Request, Response } from "express";
import { BaseController } from "../../../../core/infra/BaseController";
import { GetDevicePages } from "./get_devices.usecase";

export class GetDevicePagesController extends BaseController {
    private useCase: GetDevicePages;

    constructor(useCase: GetDevicePages) {
        super();
        this.useCase = useCase;
    }
    async executeImpl(req: Request, res: Response): Promise<any> {
        const result = await this.useCase.execute(req, res);
        if (result.isRight()) {
            const devices: Array<any> = await result.value.getValue();
            return this.ok(res, devices);
        }
        const { message } = result.value.getErrorValue();
        return this.clientError(res, message);
    }
}
