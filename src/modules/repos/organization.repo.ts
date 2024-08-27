import { IOrganizationRepo } from "./interface/organization.interface";

export class OrganizationRepo implements IOrganizationRepo {
    private models: any;

    constructor(models: any) {
        this.models = models;
    }

    async findPages(query: object): Promise<any[]> {
        return await this.models.Organization.findAndCountAll(query);
    }

    async findById(id: string): Promise<any> {
        return await this.models.Organization.findOne({
            where: {
                id: id,
            },
            paranoid: true,
        });
    }

    async create(asset: any): Promise<any> {
        try {
            const result = await this.models.Organization.create(asset);
            return result;
        } catch (err) {
            throw err;
        }
    }
}
