import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { CustomError } from "../constants/serviceConstants";
import { useAlertStore } from "../store/store";
import { getAccessToken, setAccessToken } from "../utils/cookieUtil";
import { handleLogoutCallback } from "../utils/loginUtil";
import { logout, republish } from "./authApi";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: false,
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
  (error) => {
    console.log("ererererer", error);
    Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 핸들링)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const errorCode = error.response?.data?.code;
    const { showAlert } = useAlertStore.getState();

    if (errorCode === CustomError.ACCESS_TOKEN_EXPIRED) {
      try {
        const newToken = await republish();

        setAccessToken(newToken);

        error.config.headers["Authorization"] = `Bearer ${newToken}`;

        return axiosInstance.request(error.config);

        // 예: 토큰 만료 시 로그아웃 처리
      } catch (refreshError: any) {
        await logout();
        handleLogoutCallback(() => {
          const message = refreshError.response?.data?.message;
          if (message) {
            localStorage.setItem("showPopup", message);
          }
          window.location.replace("/");
        });
        return Promise.reject(refreshError);
      }
    }

    if (errorCode === CustomError.SESSION_EXPIRED) {
      await logout();

      handleLogoutCallback(() => {
        const message = error.response?.data?.message;
        if (message) {
          localStorage.setItem("showPopup", message);
        }
        window.location.replace("/");
      });

      return Promise.reject(
        error.response as AxiosResponse<IAPI_RESPONSE<any>>
      );
    }

    if (error.response) {
      return Promise.reject(
        error.response as AxiosResponse<IAPI_RESPONSE<any>>
      );
    }

    if (!navigator.onLine) {
      showAlert(
        "네트워크 연결이 끊어졌습니다. 인터넷 연결을 확인해주세요.",
        "error"
      );

      return Promise.reject(error);
    }

    if (error.request) {
      showAlert(
        "서버와의 연결을 실패했습니다. 오류가 지속될 경우, 고객센터로 문의해주세요.",
        "error"
      );

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export interface IAPI_RESPONSE<T> {
  data: T;
  status: number;
  code: string;
  message: string;
}

export const instance = {
  get: <T>(url: string, params?: any) => {
    return axiosInstance.get<IAPI_RESPONSE<T>>(url, { params });
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
