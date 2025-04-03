import { useDesktopHeader } from "@/context/headerContext";
import Content from "@/layout/Content";
import SubHeader from "@/layout/SubHeader";
import { useAlertStore } from "@/store/store";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const MainHomeTemplate = () => {
  // };
  const qc = useQueryClient();

  const { showAlert } = useAlertStore();

  const isDesktopHeader = useDesktopHeader();

  useEffect(() => {
    const message = localStorage.getItem("showPopup");
    if (message) {
      localStorage.removeItem("showPopup");

      showAlert(message);
      qc.clear();
    }
  }, []);

  return (
    <Content headerProps={{ name: "Home" }} footerProps={{ isVisible: true }}>
      {!isDesktopHeader && <MainHomeTemplate.Mobile />}

      <Outlet />
    </Content>
  );
};

MainHomeTemplate.Mobile = () => {
  return <SubHeader menuNames={["Balance", "Prediction"]} />;
};

export default MainHomeTemplate;
