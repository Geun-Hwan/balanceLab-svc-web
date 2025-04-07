import MypageTemplate from "@/elements/templates/MypageTemplate";
import PageLayout from "@/layout/PageLayout";
import BalanceGameContent from "@cmp/BalanceGameContent";
import MainContents from "@cmp/MainContents";
import PredictContents from "@cmp/PredictContents";
import {
  BalanceDetailTemplate,
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
import PredictDetailTemplate from "@/elements/templates/PredictDetailTemplate";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <PageLayout />,
    children: [
      {
        path: "",
        element: <MainHomeTemplate />,
        children: [
          {
            path: "",
            element: <MainContents />,
          },
          {
            path: "balance",
            element: <BalanceGameContent />,
          },

          {
            path: "predict",
            element: <PredictContents />,
          },
        ],
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
        element: <SettingTemplate />,
      },

      {
        path: "balance/:questionId",
        element: <BalanceDetailTemplate />,
      },
    ],
  },
  {
    element: <AuthRoute />,
    children: [
      {
        path: "mypage",
        element: <MypageTemplate />,
      },

      {
        path: "my-games",
        element: <MyGamesTemplate />,
      },
      {
        path: "predict/:predictId",
        element: <PredictDetailTemplate />,
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
