import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, right, Result, left } from "../../../../core/logic/Result";
import { UseCaseError } from "../../../../core/logic/UseCaseError";
import { IAssetRepo } from "../../../repos/interface/asset.interface";
import { AssetDTO, AssetIdDTO } from "../../../dtos/asset.dto";
import { CommonErrors } from "../../errors/common.errors";
import models from "../../../../infra/sequelize/models";

type Response = Either<GenericAppError.UnexpectedError, any>;

class GetAssetById implements UseCase<any, Response> {
    private readonly _assetRepo: IAssetRepo;

    constructor(assetRepo: IAssetRepo) {
        this._assetRepo = assetRepo;
    }

    private async handleAssetOrError(id: string): Promise<any | Result<UseCaseError>> {
        const asset = await this._assetRepo.findById(id);
        if (!asset) {
            return new CommonErrors.FieldIdNotFound("Id");
        }
        return asset;
    }

    public async execute(req): Promise<any> {
        console.log(`BEGIN >> Params ${JSON.stringify(req.params)}`);
        const { id }: AssetIdDTO = { ...req.params };

        const assetOrError: any | Result<UseCaseError> = await this.handleAssetOrError(id);
        if (assetOrError["isFailure"]) {
            return left(assetOrError);
        }

        console.log(`END << Result ${JSON.stringify(assetOrError)}`);

        return right(Result.ok(assetOrError));
    }
}

export { GetAssetById };
