import { JointTemplate, LoginTemplate, MainHomeTemplate } from "@tmp";
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import PageLayout from "./layout/PageLayout";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <PageLayout />,
    children: [
      {
        path: "",
        element: <MainHomeTemplate />,
      },
    ],
  },
  {
    path: "login",
    element: <PageLayout />,
    children: [
      {
        path: "",
        element: <LoginTemplate />,
      },
    ],
  },
  {
    path: "join",
    element: <PageLayout />,
    children: [
      {
        path: "",
        element: <JointTemplate />,
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
