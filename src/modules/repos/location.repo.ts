import { ILocationRepo } from "./interface/location.interface";

export class LocationRepo implements ILocationRepo {
    private models: any;

    constructor(models: any) {
        this.models = models;
    }

    async findPages(query: object): Promise<any[]> {
        return await this.models.Location.findAndCountAll(query);
    }

    async findById(id: string): Promise<any> {
        return await this.models.Location.findOne({
            where: {
                id: id,
            },
            paranoid: true,
        });
    }

    async create(asset: any): Promise<any> {
        try {
            const result = await this.models.Location.create(asset);
            return result;
        } catch (err) {
            throw err;
        }
    }
}
