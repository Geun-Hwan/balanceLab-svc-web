import { isMobile } from "react-device-detect";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Container } from "@mantine/core";

const PageLayout = () => {
  return (
    <Container p={isMobile ? "xs" : "md"} m={"auto"} maw={"95%"} flex={1}>
      <Header />
      <Outlet />
    </Container>
  );
};

export default PageLayout;
