import { IAssetRepo } from "./interface/asset.interface";

export class AssetRepo implements IAssetRepo {
    private models: any;

    constructor(models: any) {
        this.models = models;
    }

    async findPages(query: object): Promise<any[]> {
        return await this.models.Asset.findAndCountAll(query);
    }

    async findById(id: string): Promise<any> {
        return await this.models.Asset.findOne({
            where: {
                id: id,
            },
            paranoid: true,
        });
    }

    async create(asset: any): Promise<any> {
        try {
            const result = await this.models.Asset.create(asset);
            return result;
        } catch (err) {
            throw err;
        }
    }
}
