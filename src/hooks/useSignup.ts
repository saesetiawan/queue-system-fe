import {useState} from "react";
import {AxiosError} from "axios";
import {RegisterCompany, SignupPayload} from "../api/auth/register.api.ts";
import {showError} from "../helpers/confirm_delete.helper.tsx";



export const UseSignup = () => {
    const [payload, setPayload] = useState<SignupPayload>({
        name: "",
        email: "",
        category: "",
        mobile: "",
        address: ""
    });
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await RegisterCompany(payload);
            setSuccess(true)
        } catch (err: unknown) {
            if(err instanceof AxiosError) {
                if(err.response?.data?.message) {
                    if(typeof err.response?.data?.message == "string") {
                        showError('Error!', err.response.data.message);
                    } else if(Array.isArray(err.response?.data?.message)) {
                        showError('Error!', err.response.data.message[0]);
                    }
                }
            }
        } finally {
            setLoading(false);
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPayload(prev => ({ ...prev, [name]: value }));
    }
    return {
        success,
        payload,
        loading,
        handleSubmit,
        handleChange
    }
}

