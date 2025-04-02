import MypageTemplate from "@/elements/templates/MypageTemplate";
import PredictTemplate from "@/elements/templates/PredictTemplate";
import PageLayout from "@/layout/PageLayout";
import {
  BalanceDetailTemplate,
  BalanceTemplate,
  ContactTemplate,
  JointTemplate,
  LoginTemplate,
  MainHomeTemplate,
  MyGamesTemplate,
  NotFoundTemplate,
  SettingTemplate,
} from "@tmp";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import AuthRoute from "./AuthRoute";

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
      {
        path: "predict",
        element: <PredictTemplate />, // 로그인한 사용자만 접근
      },
    ],
  },
  {
    element: <AuthRoute />,
    children: [
      {
        path: "mypage",
        element: <MypageTemplate />,
        children: [],
      },

      {
        path: "my-games",
        element: <MyGamesTemplate />,
        children: [],
      },
      {
        path: "balance/:questionId",
        element: <BalanceDetailTemplate />,
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

export default router;
