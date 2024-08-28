import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, right, Result, left } from "../../../../core/logic/Result";
import { LocationBodyDTO, LocationDTO } from "../../../dtos/location.dto";
import { ILocationRepo } from "../../../repos/interface/location.interface";
import { UseCaseError } from "../../../../core/logic/UseCaseError";
import { CommonErrors } from "../../errors/common.errors";
import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";
import { IOrganizationRepo } from "../../../repos/interface/organization.interface";

type Response = Either<GenericAppError.UnexpectedError, any>;

export class CreateLocation implements UseCase<any, Response> {
    private readonly _locationRepo: ILocationRepo;
    private readonly _organizationRepo: IOrganizationRepo;

    constructor(
        locationRepo: ILocationRepo,
        organizationRepo: IOrganizationRepo
    ) {
        this._locationRepo = locationRepo;
        this._organizationRepo = organizationRepo;
    }

    async handleOrganizationOrError(organizationId: string): Promise<any | Result<UseCaseError>> {
        const organizationOrError = await this._organizationRepo.findById(organizationId);
        console.log(`Organization ${JSON.stringify(organizationOrError)}`);
        if (!organizationOrError) return new CommonErrors.FieldIdNotFound("Organization");
        return organizationOrError;
    }
    
    public async execute(req): Promise<any> {
        console.log(`BEGIN >> Location: ${JSON.stringify(req.body)}`);
        const locationBody: LocationBodyDTO = { ...req.body };

        const checkExistOrganization: any | Result<UseCaseError> = await this.handleOrganizationOrError(locationBody.organization_id);
        if (checkExistOrganization["isFailure"]) {
            return left(checkExistOrganization);
        }

        const result = await this._locationRepo.create(locationBody);
        console.log(`END << Location: ${JSON.stringify(result)}`);

        return right(Result.ok(result));
    }
}
