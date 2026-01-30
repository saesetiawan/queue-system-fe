import axios_client from "../../clients/axios_client.ts";

interface LoginPayload {
    email: string;
    password: string;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export const Login = async(payload: LoginPayload) => {
    return await axios_client.post<LoginResponse>('/signin', payload);
}