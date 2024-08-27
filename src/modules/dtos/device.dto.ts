export interface DeviceBodyDTO {
    id?: number;
    location_id?: string;
    name: string;
    type: string;
    serial_number: string;
    status: string;
    created_by?: string;
    created_at?: Date;
    updated_by?: string;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface DeviceDTO {
    id?: number;
    location_id?: string;
    name: string;
    type: string;
    serial_number: string;
    status: string;
    created_by?: string;
    created_at?: Date;
    updated_by?: string;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface DeviceIdDTO {
    id: string;
}
