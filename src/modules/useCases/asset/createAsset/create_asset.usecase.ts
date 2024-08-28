import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, right, Result, left } from "../../../../core/logic/Result";
import { AssetBodyDTO, AssetDTO } from "../../../dtos/asset.dto";
import { IAssetRepo } from "../../../repos/interface/asset.interface";
import { UseCaseError } from "../../../../core/logic/UseCaseError";
import { CommonErrors } from "../../errors/common.errors";
import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";
import { ILocationRepo } from "../../../repos/interface/location.interface";

type Response = Either<GenericAppError.UnexpectedError, any>;

export class CreateAsset implements UseCase<any, Response> {
    private readonly _assetRepo: IAssetRepo;
    private readonly _locationRepo: ILocationRepo;

    constructor(
        assetRepo: IAssetRepo,
        locationRepo: ILocationRepo
    ) {
        this._assetRepo = assetRepo;
        this._locationRepo = locationRepo;
    }

    async handleLocationOrError(locationId: string): Promise<any | Result<UseCaseError>> {
        const locationOrError = await this._locationRepo.findById(locationId);
        console.log(`Location ${JSON.stringify(locationOrError)}`);
        if (!locationOrError) return new CommonErrors.FieldIdNotFound("Location");
        return locationOrError;
    }
    
    public async execute(req): Promise<any> {
        console.log(`BEGIN >> Asset: ${JSON.stringify(req.body)}`);
        const assetBody: AssetBodyDTO = { ...req.body };

        const checkExistLocation: any | Result<UseCaseError> = await this.handleLocationOrError(assetBody.location_id);
        if (checkExistLocation["isFailure"]) {
            return left(checkExistLocation);
        }

        const result = await this._assetRepo.create(assetBody);
        console.log(`END << Asset: ${JSON.stringify(result)}`);

        return right(Result.ok(result));
    }
}
