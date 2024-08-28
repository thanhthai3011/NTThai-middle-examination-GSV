export interface AssetBodyDTO {
    id?: number;
    name: string;
    type: string;
    location_id: string;
    serial: string;
    status: string;
    created_by?: string;
    created_at?: Date;
    updated_by?: string;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface AssetDTO {
    id?: number;
    name: string;
    type: string;
    location_id: string;
    serial: string;
    status: string;
    created_by?: string;
    created_at?: Date;
    updated_by?: string;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface AssetIdDTO {
    id: string;
}
