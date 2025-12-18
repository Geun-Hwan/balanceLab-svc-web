import { Alert, Container, Group, Text } from "@mantine/core";

import { useDesktopHeader } from "@/context/headerContext";
import { Outlet } from "react-router-dom";
import { useAlertStore } from "@/store/store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

const PageLayout = () => {
  const isDesktopView = useDesktopHeader();

  const { showAlert } = useAlertStore();
  const qc = useQueryClient();

  const message = localStorage.getItem("showPopup");
  const noticeKey = useMemo(() => "serviceNoticeDismissed", []);
  const [showServiceNotice, setShowServiceNotice] = useState(() => {
    return localStorage.getItem(noticeKey) !== "true";
  });

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
      {showServiceNotice && (
        <Alert
          mt="md"
          mb="md"
          color="yellow"
          variant="light"
          withCloseButton
          onClose={() => {
            localStorage.setItem(noticeKey, "true");
            setShowServiceNotice(false);
          }}
          title="서비스 종료 안내"
        >
          <Group gap="xs">
            <Text>
              현재 서비스는 종료되었으며, 본 사이트는 더미 데이터 기반으로만
              제공됩니다.
            </Text>
          </Group>
        </Alert>
      )}
      <Outlet />
    </Container>
  );
};

export default PageLayout;
