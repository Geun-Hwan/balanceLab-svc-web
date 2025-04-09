import { Container } from "@mantine/core";

import { useDesktopHeader } from "@/context/headerContext";
import { Outlet } from "react-router-dom";
import { useAlertStore } from "@/store/store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const PageLayout = () => {
  const isDesktopView = useDesktopHeader();

  const { showAlert } = useAlertStore();
  const qc = useQueryClient();

  const message = localStorage.getItem("showPopup");

  useEffect(() => {
    if (message) {
      localStorage.removeItem("showPopup");

      showAlert(message);

      setTimeout(() => {
        qc.clear();
      }, 3000);
    }
  }, []);

  return (
    <Container
      pt={0}
      fluid
      px={isDesktopView ? "xl" : "md"}
      miw={isDesktopView ? 1440 : undefined}
    >
      <Outlet />
    </Container>
  );
};

export default PageLayout;
