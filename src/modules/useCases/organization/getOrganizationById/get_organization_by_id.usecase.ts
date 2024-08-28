import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, right, Result, left } from "../../../../core/logic/Result";
import { UseCaseError } from "../../../../core/logic/UseCaseError";
import { IOrganizationRepo } from "../../../repos/interface/organization.interface";
import {
  OrganizationDTO,
  OrganizationIdDTO,
} from "../../../dtos/organization.dto";
import { CommonErrors } from "../../errors/common.errors";
import models from "../../../../infra/sequelize/models";

type Response = Either<GenericAppError.UnexpectedError, any>;

class GetOrganizationById implements UseCase<any, Response> {
  private readonly _organizationRepo: IOrganizationRepo;

  constructor(organizationRepo: IOrganizationRepo) {
    this._organizationRepo = organizationRepo;
  }

  private async handleOrganizationOrError(
    id: string
  ): Promise<any | Result<UseCaseError>> {
    const organization = await this._organizationRepo.findById(id);
    if (!organization) {
      return new CommonErrors.FieldIdNotFound("Id");
    }
    return organization;
  }

  public async execute(req): Promise<any> {
    console.log(`BEGIN >> Params ${JSON.stringify(req.params)}`);
    const { id }: OrganizationIdDTO = { ...req.params };

    const organizationOrError: any | Result<UseCaseError> =
      await this.handleOrganizationOrError(id);
    if (organizationOrError["isFailure"]) {
      return left(organizationOrError);
    }

    console.log(`END << Result ${JSON.stringify(organizationOrError)}`);

    return right(Result.ok(organizationOrError));
  }
}

export { GetOrganizationById };
