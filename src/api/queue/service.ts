import axiosClient from "../../clients/axios_client.ts";
import {QueueServiceData, QueueServiceForm} from "../../types/queue/queue_service.ts";

const prefix = '/queue/service';

interface ResponseQueueServicePagination {
    data: QueueServiceData[];
    total: number;
    page: number;
    perPage: number;
}

interface Query {
    page: number;
    perPage: number;
    column: string;
    search: string,
}

export const getQueueService = async ({ page, perPage, column, search}: Query): Promise<ResponseQueueServicePagination> => {
    const searchParams = `?page=${page}&perPage=${perPage}&search=${search}&column=${column}`;
    const res = await axiosClient.get<ResponseQueueServicePagination>(`${prefix}${searchParams}`);
    return res.data;
};

export const createQueueService = async (payload: QueueServiceForm): Promise<QueueServiceForm> => {
    const res = await axiosClient.post<QueueServiceForm>(`${prefix}`, {
        ...payload
    });
    return res.data;
};

export const updateQueueService = async (id: string, payload: QueueServiceForm): Promise<QueueServiceForm> => {
    const res = await axiosClient.put<QueueServiceForm>(`${prefix}/${id}`, {
        ...payload
    });
    return res.data;
};


export const deleteQueueService = async (id: string): Promise<QueueServiceData> => {
    const res = await axiosClient.delete<QueueServiceData>(`${prefix}/${id}`);
    return res.data;
};
