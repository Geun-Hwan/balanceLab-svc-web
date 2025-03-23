import { useDesktopHeader } from "@/context/headerContext";
import Content from "@/layout/Content";
import SubHeader from "@/layout/SubHeader";
import { useAlertStore } from "@/store/store";
import { modals } from "@mantine/modals";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PredictTemplate = () => {
  const isDesktopHeader = useDesktopHeader();
  const navigate = useNavigate();
  useEffect(() => {
    modals.openConfirmModal({
      modalId: "login_confirm",
      centered: true,
      title: "알림",
      children: "준비중입니다.",
      labels: { confirm: "뒤로가기", cancel: "취소" },
      onConfirm: () => navigate(-1),
    });
    return;
  }, []);
  return (
    <Content headerProps={{ name: "Prediction" }}>
      {!isDesktopHeader && <SubHeader menuNames={["Balance", "Prediction"]} />}
    </Content>
  );
};

export default PredictTemplate;
