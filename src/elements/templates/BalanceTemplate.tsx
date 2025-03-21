import { useDesktopView } from "@/context";
import Content from "@/layout/Content";
import Header from "@/layout/Header";

import FloatingButton from "@cmp/FloatingButton";
import MobileBalanceGameList from "@cmp/mobile/MobileBalanceGameList";
import PcBalanceGameList from "@cmp/pc/PcBalanceGameList";
import { Flex } from "@mantine/core";

const BalanceTemplate = () => {
  const isDesktopView = useDesktopView();

  return (
    <Content>
      {isDesktopView ? (
        <PcBalanceGameList />
      ) : (
        <Flex direction={"column"}>
          <Header.MobileSubHeader />
          <MobileBalanceGameList />
        </Flex>
      )}
      <FloatingButton />
    </Content>
  );
};

export default BalanceTemplate;
