import { Request, Response } from "express";
import { BaseController } from "../../../../core/infra/BaseController";
import { GetOrganizationById } from "./get_organization_by_id.usecase";

export class GetOrganizationByIdController extends BaseController {
  private useCase: GetOrganizationById;

  constructor(useCase: GetOrganizationById) {
    super();
    this.useCase = useCase;
  }
  async executeImpl(req: Request, res: Response): Promise<any> {
    const result = await this.useCase.execute(req);
    if (result.isRight()) {
      const organization = result.value.getValue();
      return this.ok<any>(res, organization);
    }
    const { message } = result.value.getErrorValue();
    return this.clientError(res, message);
  }
}
