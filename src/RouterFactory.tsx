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
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import PageLayout from "./layout/PageLayout";
import { useAlertStore, useUserStore } from "./libs/store/store";
import { useEffect } from "react";

const AuthRoute = () => {
  const { isLogin } = useUserStore();
  const { showAlert } = useAlertStore();

  useEffect(() => {
    if (!isLogin) {
      showAlert("로그인이 필요한 화면입니다.", "info");
    }
  }, []);

  if (!isLogin) {
    // 로그인하지 않은 경우, 로그인 페이지로 리다이렉트

    return <Navigate to="/login" />;
  }

  return <Outlet />; // 로그인한 경우 자식 요소를 렌더링
};

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

export const router = createBrowserRouter(routes);

export const navigateTo = (path: string | number, replace: boolean = false) => {
  if (typeof path === "string") {
    router.navigate(path, { replace });
  } else if (path === -1) {
    router.navigate(-1); // -1일 경우 뒤로 가기
  }
};

const RouterFactory = () => {
  return <RouterProvider router={router} />;
};

export default RouterFactory;
