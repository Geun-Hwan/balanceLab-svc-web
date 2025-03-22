import { useDesktopHeader } from "@/context/headerContext";
import Content from "@/layout/Content";
import SubHeader from "@/layout/SubHeader";
import { useAlertStore } from "@/store/store";
import { Box, Flex } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const MainHomeTemplate = () => {
  // };
  const qc = useQueryClient();

  const { showAlert } = useAlertStore();

  const isDesktopHeader = useDesktopHeader();

  useEffect(() => {
    if (localStorage.getItem("showPopup") === "autoLogout") {
      showAlert("자동 로그아웃 되었습니다.");
      localStorage.removeItem("showPopup");
      qc.clear();
    }
  }, []);

  return (
    <Content headerProps={{ name: "Home" }}>
      {isDesktopHeader ? (
        <MainHomeTemplate.DeskTop />
      ) : (
        <MainHomeTemplate.Mobile />
      )}
    </Content>
  );
};

MainHomeTemplate.DeskTop = () => <></>;

MainHomeTemplate.Mobile = () => {
  return (
    <Flex direction={"column"}>
      <SubHeader menuNames={["Balance", "Prediction"]} />
      <Box pt={"md"}></Box>
    </Flex>
  );
};

export default MainHomeTemplate;
