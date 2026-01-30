import {useState} from "react";
import {AxiosError} from "axios";
import {NavigateFunction } from "react-router";
import {ResetPassword} from "../api/auth/reset_password.api.ts";
import {showError, showSuccess} from "../helpers/confirm_delete.helper.tsx";


export const UseResetPassword = (navigate: NavigateFunction) => {
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await ResetPassword({ token, password });
            navigate("/signin");
            showSuccess("Success!", "Your password has been reset successfully.");
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
    return {
        token, setToken, loading, setLoading, handleSubmit, setPassword, password
    }
}

