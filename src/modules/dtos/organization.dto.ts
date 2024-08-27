export interface OrganizationBodyDTO {
    id?: number;
    name: string;
    description: string;
    created_by?: string;
    created_at?: Date;
    updated_by?: string;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface OrganizationDTO {
    id?: number;
    name: string;
    description: string;
    created_by?: string;
    created_at?: Date;
    updated_by?: string;
    updated_at?: Date;
    deleted_at?: Date;
}

export interface OrganizationIdDTO {
    id: string;
}
