import { Container } from "@mantine/core";

import { useDesktopHeader } from "@/context/headerContext";
import { Outlet } from "react-router-dom";

const PageLayout = () => {
  const isDesktopView = useDesktopHeader();
  return (
    <Container
      pt={0}
      fluid
      px={isDesktopView ? "xl" : "md"}
      miw={isDesktopView ? 1440 : undefined}
      h={"99dvh"}
      display={"flex"}
    >
      <Outlet />
    </Container>
  );
};

export default PageLayout;
