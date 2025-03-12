import { create } from "zustand";
import { ILoginResult } from "../api/authApi";
import { persist } from "zustand/middleware";
import { useMantineColorScheme } from "@mantine/core";

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

interface UserState {
  userData: ILoginResult | null;
  setUserData: (data: any) => void;
  resetStore: () => void;
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  themeColor: "light" | "dark"; // 추가된 themeColor 필드
  setThemeColor: (themeColor: "light" | "dark") => void; // themeColor를 설정하는 메서드
}
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userData: null, // 사용자 데이터 초기값
      isLogin: false, // 로그인 상태 초기값
      themeColor: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",

      setIsLogin: (isLogin: boolean) => set({ isLogin }),

      setUserData: (data: any) => set({ userData: data, isLogin: true }),
      setThemeColor: (themeColor: "light" | "dark") => set({ themeColor }),

      resetStore: () => set({ userData: null, isLogin: false }),
    }),
    {
      name: "user-storage", // 로컬 스토리지에 저장할 이름
    }
  )
);
