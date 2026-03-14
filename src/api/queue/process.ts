import axiosClient from "../../clients/axios_client.ts";
import {QueueProcessNumber} from "../../types/queue/queue_process.ts";

const prefix = '/queue/process';

export const takeNumberQueue = async (serviceId: string) => {
    const res = await axiosClient.post<QueueProcessNumber>(`${prefix}/take/number`, {
        service_id: serviceId,
    });
    return res.data;
};


export const getNumberQueue = async (serviceId: string) => {
    const res = await axiosClient.get<QueueProcessNumber>(`${prefix}/number/${serviceId}`);
    return res.data;
};