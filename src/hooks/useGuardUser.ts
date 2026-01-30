import { useEffect } from "react";
import {getCurrentUser} from "../api/auth/user.ts";
import {useLocation, useNavigate} from "react-router";

export function useAuthGuard() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            try {
                await getCurrentUser();
            } catch (err: unknown) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                navigate("/signin"); // redirect kalau token invalid
            }
        };
        checkUser()
    }, [location.pathname, navigate]);
}
