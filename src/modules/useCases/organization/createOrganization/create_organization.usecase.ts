import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, right, Result, left } from "../../../../core/logic/Result";
import {
  OrganizationBodyDTO,
  OrganizationDTO,
} from "../../../dtos/organization.dto";
import { IOrganizationRepo } from "../../../repos/interface/organization.interface";
import { UseCaseError } from "../../../../core/logic/UseCaseError";
import { CommonErrors } from "../../errors/common.errors";
import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";

type Response = Either<GenericAppError.UnexpectedError, any>;

export class CreateOrganization implements UseCase<any, Response> {
  private readonly _organizationRepo: IOrganizationRepo;

  constructor(organizationRepo: IOrganizationRepo) {
    this._organizationRepo = organizationRepo;
  }

  public async execute(req): Promise<any> {
    console.log(`BEGIN >> Organization: ${JSON.stringify(req.body)}`);
    const organizationBody: OrganizationBodyDTO = { ...req.body };

    const result = await this._organizationRepo.create(organizationBody);
    console.log(`END << Organization: ${JSON.stringify(result)}`);

    return right(Result.ok(result));
  }
}
