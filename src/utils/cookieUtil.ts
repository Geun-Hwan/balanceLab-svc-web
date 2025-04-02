import { ACCEES_TOKEN } from "@/constants/ServiceConstants";

import dayjs from "dayjs";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setAccessToken = (token: string) => {
  const expiresIn30Minutes = dayjs().add(30, "minute").toDate(); // 30분 후 만료

  setCookie(ACCEES_TOKEN, token, { expires: expiresIn30Minutes, path: "/" });
};

export const removeCookie = (name: string, options?: any) => {
  cookies.remove(name, { ...options });
};

export const setCookie = (name: string, value: string, options?: any) => {
  return cookies.set(name, value, { ...options });
};

export const getCookie = (name: string) => {
  return cookies.get(name);
};
export const getAccessToken = () => {
  return cookies.get(ACCEES_TOKEN);
};
