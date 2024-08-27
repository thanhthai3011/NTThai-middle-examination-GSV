import { Request, Response } from "express";
import { BaseController } from "../../../../core/infra/BaseController";
import { GetBenefitById } from "./get_organization_by_id.usecase";
import { BenefitDTO } from "../../../dtos/benefit.dto";


export class GetBenefitByIdController extends BaseController {
    private useCase: GetBenefitById;

    constructor(useCase: GetBenefitById) {
        super();
        this.useCase = useCase;
    }
    async executeImpl(req: Request, res: Response): Promise<any> {
        const result = await this.useCase.execute(req);
        if (result.isRight()) {
            const benefit: BenefitDTO = result.value.getValue();
            return this.ok<BenefitDTO>(res, benefit);
        }
        const { message } = result.value.getErrorValue();
        return this.clientError(res, message);
    }
}
