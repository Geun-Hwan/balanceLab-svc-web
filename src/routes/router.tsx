import PageLayout from "@/layout/PageLayout";
import { RouteObject, createBrowserRouter } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import {
  BalanceDetailTemplate,
  BalanceTemplate,
  ContactTemplate,
  JointTemplate,
  LoginTemplate,
  MainHomeTemplate,
  MyGamesTemplate,
  NotFoundTemplate,
  ParticipationsTemplate,
  SettingTemplate,
} from "@tmp";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <PageLayout />,
    children: [
      {
        path: "",
        element: <MainHomeTemplate />,
      },
      {
        path: "login",

        element: <LoginTemplate />,
      },
      {
        path: "join",
        element: <JointTemplate />,
      },

      {
        path: "contact",
        element: <ContactTemplate />,
      },
      {
        path: "setting",
        element: <SettingTemplate />, // 로그인한 사용자만 접근
      },
      {
        path: "balance",
        element: <BalanceTemplate />, // 로그인한 사용자만 접근
      },
    ],
  },
  {
    element: <AuthRoute />,
    children: [
      {
        path: "balance/:questionId",
        element: <BalanceDetailTemplate />,
        children: [],
      },
      {
        path: "my-participations",
        element: <ParticipationsTemplate />,
        children: [],
      },

      {
        path: "my-games",
        element: <MyGamesTemplate />,
        children: [],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundTemplate />,
  },
];

const router = createBrowserRouter(routes);

export const navigateTo = (path: string | number, replace: boolean = false) => {
  if (typeof path === "string") {
    router.navigate(path, { replace });
  } else if (path === -1) {
    router.navigate(-1); // -1일 경우 뒤로 가기
  }
};
export default router;
