import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { mockRequest } from "./mockBackend";

export interface IAPI_RESPONSE<T> {
  data: T;
  status: number;
  code: string;
  message: string;
}

export const instance = {
  get: <T>(url: string, params?: any): Promise<AxiosResponse<IAPI_RESPONSE<T>>> =>
    mockRequest<T>({ method: "GET", url, params }),
  post: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<IAPI_RESPONSE<T>>> =>
    mockRequest<T>({ method: "POST", url, data, params: config }),
  put: <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<IAPI_RESPONSE<T>>> =>
    mockRequest<T>({ method: "PUT", url, data, params: config }),
  delete: <T>(
    url: string,
    params?: any
  ): Promise<AxiosResponse<IAPI_RESPONSE<T>>> =>
    mockRequest<T>({ method: "DELETE", url, params }),
};
