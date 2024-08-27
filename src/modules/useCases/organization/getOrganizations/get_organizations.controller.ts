import { Request, Response } from "express";
import { BaseController } from "../../../../core/infra/BaseController";
import { GetBenefitPages } from "./get_organizations.usecase";
import { Benefit } from "../../../domain/benefit/benefit.domain";

export class GetBenefitPagesController extends BaseController {
    private useCase: GetBenefitPages;

    constructor(useCase: GetBenefitPages) {
        super();
        this.useCase = useCase;
    }
    async executeImpl(req: Request, res: Response): Promise<any> {
        const result = await this.useCase.execute(req, res);
        if (result.isRight()) {
            const benefits: Array<Benefit> = await result.value.getValue();
            return this.ok(res, benefits);
        }
        const { message } = result.value.getErrorValue();
        return this.clientError(res, message);
    }
}
