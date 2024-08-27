import { Request, Response } from "express";
import { BaseController } from "../../../../core/infra/BaseController";
import { ChangeStatusLoyaltyPromotion } from "./change_status_loyalty_promotion.usecase";

export class ChangeStatusLoyaltyPromotionController extends BaseController {
    private useCase: ChangeStatusLoyaltyPromotion;

    constructor(useCase: ChangeStatusLoyaltyPromotion) {
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
