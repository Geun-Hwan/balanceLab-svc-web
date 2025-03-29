import { Container } from "@mantine/core";

import { useDesktopHeader } from "@/context/headerContext";
import { Outlet } from "react-router-dom";
import AdsenseAd from "@/elements/ads/AdsenseAd";

const PageLayout = () => {
  const isDesktopView = useDesktopHeader();
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
