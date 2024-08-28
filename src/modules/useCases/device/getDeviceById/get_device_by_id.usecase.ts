import { UseCase } from "../../../../core/domain/UseCase";
import { GenericAppError } from "../../../../core/logic/AppError";
import { Either, right, Result, left } from "../../../../core/logic/Result";
import { UseCaseError } from "../../../../core/logic/UseCaseError";
import { IDeviceRepo } from "../../../repos/interface/device.interface";
import { DeviceDTO, DeviceIdDTO } from "../../../dtos/device.dto";
import { CommonErrors } from "../../errors/common.errors";
import models from "../../../../infra/sequelize/models";

type Response = Either<GenericAppError.UnexpectedError, any>;

class GetDeviceById implements UseCase<any, Response> {
    private readonly _deviceRepo: IDeviceRepo;

    constructor(deviceRepo: IDeviceRepo) {
        this._deviceRepo = deviceRepo;
    }

    private async handleDeviceOrError(id: string): Promise<any | Result<UseCaseError>> {
        const device = await this._deviceRepo.findById(id);
        if (!device) {
            return new CommonErrors.FieldIdNotFound("Id");
        }
        return device;
    }

    public async execute(req): Promise<any> {
        console.log(`BEGIN >> Params ${JSON.stringify(req.params)}`);
        const { id }: DeviceIdDTO = { ...req.params };

        const deviceOrError: any | Result<UseCaseError> = await this.handleDeviceOrError(id);
        if (deviceOrError["isFailure"]) {
            return left(deviceOrError);
        }

        console.log(`END << Result ${JSON.stringify(deviceOrError)}`);

        return right(Result.ok(deviceOrError));
    }
}

export { GetDeviceById };
