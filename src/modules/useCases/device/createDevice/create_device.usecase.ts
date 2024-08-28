import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, right, Result, left } from "../../../../core/logic/Result";
import { DeviceBodyDTO, DeviceDTO } from "../../../dtos/device.dto";
import { IDeviceRepo } from "../../../repos/interface/device.interface";
import { UseCaseError } from "../../../../core/logic/UseCaseError";
import { CommonErrors } from "../../errors/common.errors";
import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";
import { ILocationRepo } from "../../../repos/interface/location.interface";

type Response = Either<GenericAppError.UnexpectedError, any>;

export class CreateDevice implements UseCase<any, Response> {
    private readonly _deviceRepo: IDeviceRepo;
    private readonly _locationRepo: ILocationRepo;

    constructor(
        deviceRepo: IDeviceRepo,
        locationRepo: ILocationRepo
    ) {
        this._deviceRepo = deviceRepo;
        this._locationRepo = locationRepo;
    }

    async handleLocationOrError(locationId: string): Promise<any | Result<UseCaseError>> {
        const locationOrError = await this._locationRepo.findById(locationId);
        console.log(`Location ${JSON.stringify(locationOrError)}`);
        if (!locationOrError) return new CommonErrors.FieldIdNotFound("Location");
        return locationOrError;
    }
    
    public async execute(req): Promise<any> {
        console.log(`BEGIN >> Device: ${JSON.stringify(req.body)}`);
        const deviceBody: DeviceBodyDTO = { ...req.body };

        const checkExistLocation: any | Result<UseCaseError> = await this.handleLocationOrError(deviceBody.location_id);
        if (checkExistLocation["isFailure"]) {
            return left(checkExistLocation);
        }

        const result = await this._deviceRepo.create(deviceBody);
        console.log(`END << Device: ${JSON.stringify(result)}`);

        return right(Result.ok(result));
    }
}
