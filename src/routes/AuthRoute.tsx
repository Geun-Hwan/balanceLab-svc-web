import PageLayout from "@/layout/PageLayout";
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
    return <Navigate to="/login" />;
  }

  return <PageLayout />; // 로그인한 경우 자식 요소를 렌더링
};

export default AuthRoute;
