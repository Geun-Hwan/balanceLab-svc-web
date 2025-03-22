import Content from "@/layout/Content";
import Header from "@/layout/Header";

import { useDesktopHeader } from "@/context/headerContext";
import BalanceGameList from "@cmp/BalanceGameList";
import FloatingButton from "@cmp/FloatingButton";

const BalanceTemplate = () => {
  const isDesktopHeader = useDesktopHeader();
  return (
    <Content>
      {!isDesktopHeader && <Header.MobileSubHeader />}
      <BalanceGameList />

      <FloatingButton />
    </Content>
  );
};

export default BalanceTemplate;
