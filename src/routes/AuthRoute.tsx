import { useUserStore, useAlertStore } from "@/store/store";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

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

export default AuthRoute;
