import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, right, Result, left } from "../../../../core/logic/Result";
import { UseCaseError } from "../../../../core/logic/UseCaseError";
import { ILocationRepo } from "../../../repos/interface/location.interface";
import { LocationDTO, LocationIdDTO } from "../../../dtos/location.dto";
import { CommonErrors } from "../../errors/common.errors";
import models from "../../../../infra/sequelize/models";

type Response = Either<GenericAppError.UnexpectedError, any>;

class GetLocationById implements UseCase<any, Response> {
    private readonly _locationRepo: ILocationRepo;

    constructor(locationRepo: ILocationRepo) {
        this._locationRepo = locationRepo;
    }

    private async handleLocationOrError(id: string): Promise<any | Result<UseCaseError>> {
        const location = await this._locationRepo.findById(id);
        if (!location) {
            return new CommonErrors.FieldIdNotFound("Id");
        }
        return location;
    }

    public async execute(req): Promise<any> {
        console.log(`BEGIN >> Params ${JSON.stringify(req.params)}`);
        const { id }: LocationIdDTO = { ...req.params };

        const locationOrError: any | Result<UseCaseError> = await this.handleLocationOrError(id);
        if (locationOrError["isFailure"]) {
            return left(locationOrError);
        }

        console.log(`END << Result ${JSON.stringify(locationOrError)}`);

        return right(Result.ok(locationOrError));
    }
}

export { GetLocationById };
