import { ILoginResult } from "../api/authApi";
import { useUserStore } from "../store/store";
import { removeCookie, setAccessToken } from "./cookieUtil";
import { ACCEES_TOKEN } from "../constants/serviceConstants";
import { navigateTo } from "@/routes/router";

export const handleLoginSuccess = (data: ILoginResult) => {
  const { setIsLogin, setUserData } = useUserStore.getState();

  const { accessToken, ...rest } = data;
  setAccessToken(accessToken);
  setIsLogin(true);
  setUserData(rest);
  navigateTo("/");
};

export const handleLogoutCallback = () => {
  // 쿠키 제거
  const { resetStore } = useUserStore.getState();

  removeCookie(ACCEES_TOKEN);
  resetStore();

  navigateTo("/login");
};
