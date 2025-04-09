import { ACCEES_TOKEN } from "@/constants/ServiceConstants";
import { ILoginResult } from "../service/authApi";
import { useGuestStore, useUserStore } from "../store/store";
import { removeCookie, setAccessToken } from "./cookieUtil";

export const handleLoginSuccess = (
  data: ILoginResult,
  callback?: () => void
) => {
  const { setIsLogin, setUserData, setRememberId, idSaveCheck } =
    useUserStore.getState();

  const { accessToken, ...rest } = data;

  if (accessToken) {
    setAccessToken(accessToken);
  }
  setUserData(rest);
  setIsLogin(true);

  setRememberId(idSaveCheck ? rest.loginId : null);
  useGuestStore.getState().resetVotes();
  if (callback) {
    callback();
  }
};

export const handleLogoutCallback = (callback?: () => void) => {
  const { resetStore } = useUserStore.getState();
  removeCookie(ACCEES_TOKEN);

  if (callback) {
    callback();
  }
  resetStore();
};
