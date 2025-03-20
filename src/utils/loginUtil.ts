import { ILoginResult } from "../api/authApi";
import { useUserStore } from "../store/store";
import { removeCookie, setAccessToken } from "./cookieUtil";
import { ACCEES_TOKEN } from "../constants/serviceConstants";
import { navigateTo } from "@/routes/router";

export const handleLoginSuccess = (data: ILoginResult) => {
  const { setIsLogin, setUserData } = useUserStore.getState();

  const { accessToken, ...rest } = data;
  setAccessToken(accessToken);
  setUserData(rest);
  setIsLogin(true);
  navigateTo("/");
};

export const handleLogoutCallback = () => {
  const { resetStore } = useUserStore.getState();
  resetStore();
  removeCookie(ACCEES_TOKEN);

  navigateTo("/login");
};
