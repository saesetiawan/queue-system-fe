import axios_client from "../../clients/axios_client.ts";

export interface SignupPayload {
    name: string;
    email: string;
    category: string;
    mobile: string;
    address: string;
}

export const RegisterCompany = async(payload: SignupPayload) => {
    return await axios_client.post<string>('/company/register', payload);
}