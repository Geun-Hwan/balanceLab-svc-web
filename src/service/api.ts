import { AUTH_ERROR } from "@/constants/ErrorConstants";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { useAlertStore } from "../store/store";
import { getAccessToken, setAccessToken } from "../utils/cookieUtil";
import { handleLogoutCallback } from "../utils/loginUtil";
import { logout, republish } from "./authApi";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

let isRefreshing = false; // 토큰 갱신 상태 추적
let failedQueue: Array<(data?: any) => any> = []; // 실패한 요청들을 저장하는 큐
let isLoggingOut = false;
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

    if (errorCode === AUTH_ERROR.ACCESS_TOKEN_EXPIRED) {
      const originalRequest = error.config;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await republish();

          setAccessToken(newToken);

          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          failedQueue.forEach((callback) => callback(newToken));
          failedQueue = [];
          return axiosInstance.request(originalRequest);

          // 예: 토큰 만료 시 로그아웃 처리
        } catch (response: any) {
          isLoggingOut = true;
          await logout();
          failedQueue = []; // 큐 초기화

          handleLogoutCallback(() => {
            const message = response?.data?.message;
            if (message) {
              localStorage.setItem("showPopup", message);
            }
            window.location.replace("/");
          });
          return Promise.reject(response);
        } finally {
          isRefreshing = false; // 갱신 완료
          isLoggingOut = false;
        }
      } else {
        return new Promise((resolve) => {
          failedQueue.push((newToken) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(axiosInstance.request(originalRequest));
          });
        });
      }
    }

    if (
      errorCode === AUTH_ERROR.SESSION_EXPIRED &&
      !isLoggingOut &&
      !isRefreshing
    ) {
      isLoggingOut = true;

      try {
        await logout(); // 로그아웃 처리

        handleLogoutCallback(() => {
          const message = error.response?.data?.message;
          if (message) {
            localStorage.setItem("showPopup", message); // 팝업 메시지 저장
          }
          window.location.replace("/"); // 홈 페이지로 리다이렉트
        });
      } finally {
        isLoggingOut = false; // 로그아웃 처리 완료 후 플래그 리셋
      }

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
