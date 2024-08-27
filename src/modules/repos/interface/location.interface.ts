
export interface ILocationRepo {
    findPages(query: object): Promise<any[]>;
    findById(id: string): Promise<any>;
    create(location: any | any): Promise<any>;
}

