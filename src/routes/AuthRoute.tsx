import PageLayout from "@/layout/PageLayout";
import { useAlertStore, useUserStore } from "@/store/store";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const AuthRoute = () => {
  const { isLogin } = useUserStore();
  const { showAlert, alertVisible } = useAlertStore();

  useEffect(() => {
    if (!isLogin) {
      showAlert("로그인이 필요한 화면입니다.", "info");
    }
  }, []);

  if (!isLogin && !alertVisible) {
    return <Navigate to="/login" replace />;
  }

  return <PageLayout />; // 로그인한 경우 자식 요소를 렌더링
};

export default AuthRoute;
