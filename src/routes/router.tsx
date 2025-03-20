import PageLayout from "@/layout/PageLayout";
import { RouteObject, createBrowserRouter } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import {
  BalanceDetailTemplate,
  ContactTemplate,
  JointTemplate,
  LoginTemplate,
  MainHomeTemplate,
  MyGamesTemplate,
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
        path: "my-games",
        element: <AuthRoute />,
        children: [
          {
            path: "",
            element: <MyGamesTemplate />, // 로그인한 사용자만 접근
          },
        ],
      },
      {
        path: "my-participations",
        element: <AuthRoute />,
        children: [
          {
            path: "",
            element: <ParticipationsTemplate />, // 로그인한 사용자만 접근
          },
        ],
      },

      {
        path: "question",
        element: <AuthRoute />,
        children: [
          {
            path: ":questionId",
            element: <BalanceDetailTemplate />,
          },

          {
            path: "rgstr",
            element: <></>,
          },
        ],
      },
    ],
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
