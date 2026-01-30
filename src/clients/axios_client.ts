import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

interface RefreshResponse {
    accessToken: string;
    refreshToken?: string; // kalau backend kasih refresh baru juga
}

interface FailedQueueItem {
    resolve: (token?: string) => void;
    reject: (error: unknown) => void;
}
const axiosClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Request interceptor → inject access_token
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Refresh logic
let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token ?? undefined);
        }
    });
    failedQueue = [];
};

// Response interceptor
axiosClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError): Promise<AxiosResponse | never> => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url &&
            !originalRequest.url.includes("/signin") &&
            !originalRequest.url.includes("/refresh-token")
        ) {
            if (isRefreshing) {
                // tunggu token baru kalau sedang refresh
                return new Promise<AxiosResponse>((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token?: string) => {
                            if (token && originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                            }
                            resolve(axiosClient(originalRequest));
                        },
                        reject,
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) throw new Error("No refresh token");

                const response = await axios.post<RefreshResponse>(
                    `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/refresh-token`,
                    { refreshToken: refreshToken }
                );

                const newAccessToken = response.data.accessToken;
                localStorage.setItem("accessToken", newAccessToken);
                axiosClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

                processQueue(null, newAccessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }

                return axiosClient(originalRequest);
            } catch (err) {
                processQueue(err, null);
                // localStorage.removeItem("accessToken");
                // localStorage.removeItem("accessToken");
                // window.location.href = "/signin";
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
