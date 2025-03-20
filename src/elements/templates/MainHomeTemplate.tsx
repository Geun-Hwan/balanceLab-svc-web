import { BrowserView, MobileView } from "react-device-detect";
import MobileBalanceGameList from "../components/mobile/MobileBalanceGameList";
import PCBalanceGameList from "../components/pc/PcBalanceGameList";
import { useDesktopView } from "@/context";

const MainHomeTemplate = () => {
  // };
  const isDesktopView = useDesktopView();
  return (
    <>
      <BrowserView renderWithFragment={true}>
        <PCBalanceGameList />
      </BrowserView>

      <MobileView renderWithFragment={true}>
        {isDesktopView ? <PCBalanceGameList /> : <MobileBalanceGameList />}
      </MobileView>
    </>
  );
};

export default MainHomeTemplate;
