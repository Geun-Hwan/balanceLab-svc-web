import { useDesktopView } from "@/context";
import Content from "@/layout/Content";
import FloatingButton from "@cmp/FloatingButton";
import MobileBalanceGameList from "@cmp/mobile/MobileBalanceGameList";
import PcBalanceGameList from "@cmp/pc/PcBalanceGameList";

const BalanceTemplate = () => {
  const isDesktopView = useDesktopView();
  return (
    <Content>
      {isDesktopView ? <PcBalanceGameList /> : <MobileBalanceGameList />}
      <FloatingButton />
    </Content>
  );
};

export default BalanceTemplate;
