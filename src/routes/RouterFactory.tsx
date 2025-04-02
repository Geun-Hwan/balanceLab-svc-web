import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { getTotalPoint, getUserKey } from "../service/userApi";

import { useUserStore } from "@/store/store";
import router from "./router";

const RouterFactory = () => {
  const { isLogin, setUserPoint } = useUserStore();

  const { data, isLoading } = useQuery({
    queryKey: getUserKey({ totalPoint: true }),
    queryFn: () => getTotalPoint(),
    enabled: isLogin,
    staleTime: 1000 * 60 * 60,
  });

  useEffect(() => {
    if (!isLoading) {
      if (typeof data === "number") setUserPoint(data);
    }
  }, [data, isLoading]);

  return <RouterProvider router={router} />;
};

export default RouterFactory;
