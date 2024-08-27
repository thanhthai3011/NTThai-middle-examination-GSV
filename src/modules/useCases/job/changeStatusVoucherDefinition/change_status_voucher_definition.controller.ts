import { Request, Response } from "express";
import { BaseController } from "../../../../core/infra/BaseController";
import { ChangeStatusVoucherDefinition } from "./change_status_voucher_definition.usecase";

export class ChangeStatusVoucherDefinitionController extends BaseController {
    private useCase: ChangeStatusVoucherDefinition;

    constructor(useCase: ChangeStatusVoucherDefinition) {
        super();
        this.useCase = useCase;
    }
    async executeImpl(req: Request, res: Response): Promise<any> {
        const result = await this.useCase.execute(req);
        if (result.isRight()) {
            const autoUpdateStatus = result.value.getValue();
            return this.ok(res, autoUpdateStatus);
        }
        const { message } = result.value.getErrorValue();
        return this.clientError(res, message);
    }
}
