
export interface IDeviceRepo {
    findPages(query: object): Promise<any[]>;
    findById(id: string): Promise<any>;
    create(device: any | any): Promise<any>;
}

