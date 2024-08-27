export interface IOrganizationRepo {
    findPages(query: object): Promise<any[]>;
    findById(orgId: string): Promise<any>;
    create(organization: any | any): Promise<any>;
}
