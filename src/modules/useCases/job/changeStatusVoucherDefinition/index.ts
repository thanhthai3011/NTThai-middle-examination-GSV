import { ChangeStatusVoucherDefinition } from "./change_status_voucher_definition.usecase";
import { ChangeStatusVoucherDefinitionController } from "./change_status_voucher_definition.controller";

const changeStatusVoucherDefinition = new ChangeStatusVoucherDefinitionController(new ChangeStatusVoucherDefinition());

export { changeStatusVoucherDefinition };