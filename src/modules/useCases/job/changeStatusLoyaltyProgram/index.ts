import { ChangeStatusLoyaltyProgram } from "./change_status_loyalty_program.usecase";
import { ChangeStatusLoyaltyProgramController } from "./change_status_loyalty_program.controller";

const changeStatusLoyaltyProgram = new ChangeStatusLoyaltyProgramController(new ChangeStatusLoyaltyProgram());

export { changeStatusLoyaltyProgram };