import axios_client from "../../clients/axios_client.ts";

interface ResetPasswordPayload {
    token: string;
    password: string;
}

interface ResetPasswordResponse {
    message: string;
}

export const ResetPassword = async(payload: ResetPasswordPayload) => {
    return await axios_client.post<ResetPasswordResponse>('/reset-password', payload);
}