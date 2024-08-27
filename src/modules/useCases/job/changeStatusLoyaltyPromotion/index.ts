import { ChangeStatusLoyaltyPromotion } from "./change_status_loyalty_promotion.usecase";
import { ChangeStatusLoyaltyPromotionController } from "./change_status_loyalty_promotion.controller";

const changeStatusLoyaltyPromotion = new ChangeStatusLoyaltyPromotionController(new ChangeStatusLoyaltyPromotion());

export { changeStatusLoyaltyPromotion };