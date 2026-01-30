import {useState} from "react";
import {Login} from "../api/auth/login.api.ts";
import {AxiosError} from "axios";
import {NavigateFunction } from "react-router";


export const UseLogin = (navigate: NavigateFunction) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await Login({ email, password });
            if (res.data.accessToken) {
                localStorage.setItem("accessToken", res.data.accessToken);
                localStorage.setItem("refreshToken", res.data.refreshToken);
            }
            navigate("/");
        } catch (err: unknown) {
            if(err instanceof AxiosError) {
                console.error("Login failed:", err.response?.data || err.message);
            }
        } finally {
            setLoading(false);
        }
    };
    return {
        email, setEmail, loading, setLoading, handleSubmit, setPassword, password
    }
}

