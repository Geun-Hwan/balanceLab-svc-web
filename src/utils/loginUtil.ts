import { navigateTo } from "@/routes/router";
import { ILoginResult } from "../api/authApi";
import { ACCEES_TOKEN } from "../constants/serviceConstants";
import { useUserStore } from "../store/store";
import { removeCookie, setAccessToken } from "./cookieUtil";

export const handleLoginSuccess = (
  data: ILoginResult,
  callback?: () => void
) => {
  const { setIsLogin, setUserData } = useUserStore.getState();

  const { accessToken, ...rest } = data;
  setAccessToken(accessToken);
  setUserData(rest);
  setIsLogin(true);

  if (callback) {
    callback();
  } else {
    navigateTo("/");
  }
};

export const handleLogoutCallback = (callback?: () => void) => {
  const { resetStore } = useUserStore.getState();
  resetStore();

  removeCookie(ACCEES_TOKEN);

  requestAnimationFrame(() => {
    if (callback) {
      callback();
    } else {
      navigateTo("/");
    }
  });
};
