import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ILoginResult } from "../../api/authApi";

export type AlertType = "error" | "success" | "info" | "warning"; // 알림 타입

interface AlertStore {
  alertMessage: string;
  alertVisible: boolean;
  alertType: AlertType;

  showAlert: (message: string, alertType?: AlertType) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertStore>((set) => ({
  alertMessage: "",
  alertVisible: false,
  alertType: "info",
  showAlert: (message: string, alertType: AlertType = "info") =>
    set({ alertMessage: message, alertVisible: true, alertType }),
  hideAlert: () => set({ alertVisible: false }),
}));

type themeType = "light" | "dark";
interface UserState {
  userData: ILoginResult | null;
  idSaveCheck: boolean;
  isLogin: boolean;
  themeColor: themeType;
  animationEnable: boolean;
  rememberId: string | null;
}
interface UserSetState {
  setThemeColor: (themeColor: "light" | "dark") => void; // themeColor를 설정하는 메서드
  setIsLogin: (isLogin: boolean) => void;
  setUserPoint: (totalPoint: number) => void;
  setIdSaveCheck: (idSaveCheck: boolean) => void;
  setUserData: (data: any) => void;
  resetStore: () => void;
  toggleAnimation: () => void;
  setRememberId: (rememberId: string | null) => void;
}

interface UserStore extends UserState, UserSetState {}

const initialState: UserState = {
  userData: null,
  isLogin: false,
  themeColor: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light",
  animationEnable: true,
  idSaveCheck: false,
  rememberId: null,
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      ...initialState,
      setIdSaveCheck: (idSaveCheck: boolean) => set({ idSaveCheck }),

      setIsLogin: (isLogin: boolean) => set({ isLogin }),
      setUserData: (data: any) => set({ userData: data, isLogin: true }),
      setThemeColor: (themeColor: "light" | "dark") => set({ themeColor }),
      toggleAnimation: () => {
        set((state) => ({ animationEnable: !state.animationEnable }));
      },
      setUserPoint: (totalPoint: number) => {
        set((state) => {
          if (state.userData) {
            return {
              userData: {
                ...state.userData,
                totalPoint,
              },
            };
          }
          return state;
        });
      },
      setRememberId: (rememberId: string | null) => set({ rememberId }),

      resetStore: () => set({ userData: null, isLogin: false }),
    }),
    {
      name: "user-storage", // 로컬 스토리지에 저장할 이름
    }
  )
);
