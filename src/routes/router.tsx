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
        path: "sitemap.xml",
        element: null,
      },
      {
        path: "@api/*",
        element: null,
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
        path: "balance",
        element: <BalanceTemplate />,
      },

      {
        path: "balance/public/:questionId",
        element: <BalanceDetailTemplate isPublic={true} />,
      },

      {
        path: "predict",
        element: <PredictTemplate />,
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
        path: "balance/:questionId",
        element: <BalanceDetailTemplate />,
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

export default router;
