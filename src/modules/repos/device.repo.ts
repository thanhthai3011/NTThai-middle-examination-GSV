import { IDeviceRepo } from "./interface/device.interface";

export class DeviceRepo implements IDeviceRepo {
    private models: any;

    constructor(models: any) {
        this.models = models;
    }

    async findPages(query: object): Promise<any[]> {
        return await this.models.Device.findAndCountAll(query);
    }

    async findById(id: string): Promise<any> {
        return await this.models.Device.findOne({
            where: {
                id: id,
            },
            paranoid: true,
        });
    }

    async create(asset: any): Promise<any> {
        try {
            const result = await this.models.Device.create(asset);
            return result;
        } catch (err) {
            throw err;
        }
    }
}
