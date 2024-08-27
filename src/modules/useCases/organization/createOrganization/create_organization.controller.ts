import { Request, Response } from "express";
import { BaseController } from "../../../../core/infra/BaseController";
import { CreateBenefit } from "./create_organization.usecase";

export class CreateBenefitController extends BaseController {
    private useCase: CreateBenefit;

    constructor(useCase: CreateBenefit) {
        super();
        this.useCase = useCase;
    }
    async executeImpl(req: Request, res: Response): Promise<any> {
        const result = await this.useCase.execute(req);
        if (result?.isRight()) {
            const benefit = result.value.getValue();
            return this.ok<any>(res, benefit);
        }
        const { message } = result.value.getErrorValue();
        return this.clientError(res, message);
    }
}
