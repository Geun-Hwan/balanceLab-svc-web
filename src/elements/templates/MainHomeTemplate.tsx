import Content from "@/layout/Content";
import MobileBalanceGameList from "../components/mobile/MobileBalanceGameList";
import PCBalanceGameList from "../components/pc/PcBalanceGameList";
import { useDesktopView } from "@/context";

const MainHomeTemplate = () => {
  // };
  const isDesktopView = useDesktopView();
  return (
    <Content>
      <>메에인</>
    </Content>
  );
};

export default MainHomeTemplate;
