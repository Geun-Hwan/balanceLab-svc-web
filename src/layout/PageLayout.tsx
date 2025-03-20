import { Container } from "@mantine/core";
import { isMobile } from "react-device-detect";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const PageLayout = () => {
  return (
    <Container p={isMobile ? "md" : "xl"} m={"auto"} fluid size="responsive">
      <Header />

      <Outlet />
    </Container>
  );
};

export default PageLayout;
