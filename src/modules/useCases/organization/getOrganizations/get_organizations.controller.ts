import { Request, Response } from "express";
import { BaseController } from "../../../../core/infra/BaseController";
import { GetOrganizationPages } from "./get_organizations.usecase";

export class GetOrganizationPagesController extends BaseController {
  private useCase: GetOrganizationPages;

  constructor(useCase: GetOrganizationPages) {
    super();
    this.useCase = useCase;
  }
  async executeImpl(req: Request, res: Response): Promise<any> {
    const result = await this.useCase.execute(req, res);
    if (result.isRight()) {
      const organizations: Array<any> = await result.value.getValue();
      return this.ok(res, organizations);
    }
    const { message } = result.value.getErrorValue();
    return this.clientError(res, message);
  }
}
