export interface LocationBodyDTO {
    id?: number;
    organization_id: string;
    name: string;
    address: string;
    created_by?: string;
    created_at?: Date;
    updated_by?: string;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface LocationDTO {
    id?: number;
    organization_id: string;
    name: string;
    address: string;
    created_by?: string;
    created_at?: Date;
    updated_by?: string;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface LocationIdDTO {
    id: string;
}
