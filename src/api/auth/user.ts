import axiosClient from "../../clients/axios_client.ts";


export interface CurrentUser {
    id: string;
    email: string;
    name: string;
}

export const getCurrentUser = async (): Promise<CurrentUser> => {
    const res = await axiosClient.get<CurrentUser>("/auth/current-user");
    return res.data;
};
