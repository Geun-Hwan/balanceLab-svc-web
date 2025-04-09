import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ILoginResult } from "../service/authApi";

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
  idSaveCheck: boolean;
  isLogin: boolean;
  rememberId: string | null;
}
interface UserSetState {
  setIsLogin: (isLogin: boolean) => void;
  setUserPoint: (totalPoint: number) => void;
  setIdSaveCheck: (idSaveCheck: boolean) => void;
  setUserData: (data: any) => void;
  resetStore: () => void;
  setRememberId: (rememberId: string | null) => void;
}

interface UserStore extends UserState, UserSetState {}

const initialState: UserState = {
  userData: null,
  isLogin: false,

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

type GuestVote = {
  questionId: string;
  choiceType: "A" | "B";
};

interface GuestStore {
  votes: GuestVote[];
  addVote: (vote: GuestVote) => void;
  hasVoted: (questionId: string) => boolean;
  getVoteChoice: (questionId: string) => "A" | "B" | null;
  resetVotes: () => void;
}

export const useGuestStore = create<GuestStore>()(
  persist(
    (set, get) => ({
      votes: [],

      addVote: (vote: GuestVote) => {
        const existing = get().votes.find(
          (v) => v.questionId === vote.questionId
        );
        const updatedVotes = existing
          ? get().votes.map((v) =>
              v.questionId === vote.questionId ? vote : v
            )
          : [...get().votes, vote];

        set({ votes: updatedVotes });
      },

      hasVoted: (questionId: string) =>
        get().votes.some((v) => v.questionId === questionId),

      getVoteChoice: (questionId: string) => {
        const found = get().votes.find((v) => v.questionId === questionId);
        return found ? found.choiceType : null;
      },

      resetVotes: () => set({ votes: [] }),
    }),
    {
      name: "guest-votes-storage", // localStorage key
    }
  )
);

type themeType = "light" | "dark";
type langType = "ko" | "en";

interface WebSettingState {
  animationEnable: boolean;
  toggleAnimation: () => void;
  themeColor: themeType;
  setThemeColor: (themeColor: "light" | "dark") => void; // themeColor를 설정하는 메서드
  language: langType;
  setLanguage: (language: langType | string | null) => void; // language를 설정하는 메서드
}

export const useSettingStore = create<WebSettingState>()(
  persist(
    (set) => ({
      animationEnable: true,
      toggleAnimation: () => {
        set((state) => ({ animationEnable: !state.animationEnable }));
      },
      setThemeColor: (themeColor: "light" | "dark") => set({ themeColor }),

      themeColor: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
      language: navigator.language.startsWith("ko") ? "ko" : "en",
      setLanguage: (language: langType | string | null) =>
        set({ language: language as langType }),
    }),
    {
      name: "web-setting-storage", // localStorage key
    }
  )
);
