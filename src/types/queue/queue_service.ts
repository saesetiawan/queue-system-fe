
export interface QueueServiceData {
    id: string;
    tenant_id: string;
    name: string;
    description?: string;
}

export interface QueueServiceForm {
    id: string;
    name: string;
    description: string;
}