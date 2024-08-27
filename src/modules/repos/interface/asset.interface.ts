
export interface IAssetRepo {
    findPages(query: object): Promise<any[]>;
    findById(id: string): Promise<any>;
    create(asset: any | any): Promise<any>;
}

