import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { logout, republish } from "./api/authApi";
import { getAccessToken, setAccessToken } from "./utils/cookieUtil";
import { handleLogoutCallback } from "./utils/loginUtil";
import { CustomError } from "./utils/serviceConstants";

const apiUrl = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (예: 토큰 추가)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (에러 핸들링)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const errorCode = error.response?.data?.code;

    if (errorCode === CustomError.ACCESS_TOKEN_EXPIRED) {
      try {
        const newToken = await republish();

        setAccessToken(newToken);

        error.config.headers["Authorization"] = `Bearer ${newToken}`;

        return axiosInstance.request(error.config);

        // 예: 토큰 만료 시 로그아웃 처리
      } catch (refreshError) {
        //  CustomError.SESSION_EXPIRED
        console.error("토큰 재발급 실패, 로그아웃 처리");
        await logout();

        handleLogoutCallback();
        return Promise.reject(refreshError);
      }
    }

    if (errorCode === CustomError.SESSION_EXPIRED) {
      await logout();
      handleLogoutCallback();
      return Promise.reject(
        error.response as AxiosResponse<IAPI_RESPONSE<any>>
      );
    }

    return Promise.reject(error.response as AxiosResponse<IAPI_RESPONSE<any>>);
  }
);

interface IAPI_RESPONSE<T> {
  data: T;
  status: number;
  code: string;
  message: string;
}

export const instance = {
  get: <T>(url: string, params?: any) => {
    return axiosInstance.get<IAPI_RESPONSE<T>>(url, { params: params });
  },
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return axiosInstance.post<IAPI_RESPONSE<T>>(url, data, config);
  },

  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    return axiosInstance.put<IAPI_RESPONSE<T>>(url, data, config);
  },

  delete: <T>(url: string, params?: any) => {
    return axiosInstance.delete<IAPI_RESPONSE<T>>(url, { params: params });
  },
};
