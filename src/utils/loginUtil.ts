import { ILoginResult } from "../api/authApi";
import { ACCEES_TOKEN } from "../constants/serviceConstants";
import { useUserStore } from "../store/store";
import { removeCookie, setAccessToken } from "./cookieUtil";

export const handleLoginSuccess = (
  data: ILoginResult,
  callback?: () => void
) => {
  const { setIsLogin, setUserData, setRememberId, idSaveCheck } =
    useUserStore.getState();

  const { accessToken, ...rest } = data;
  setAccessToken(accessToken);
  setUserData(rest);
  setIsLogin(true);

  setRememberId(idSaveCheck ? rest.loginId : null);

  if (callback) {
    callback();
  } else {
    window.location.replace("/");
  }
};

export const handleLogoutCallback = (callback?: () => void) => {
  const { resetStore } = useUserStore.getState();
  resetStore();

  removeCookie(ACCEES_TOKEN);

  if (callback) {
    callback();
  } else {
    window.location.replace("/");
  }
};
