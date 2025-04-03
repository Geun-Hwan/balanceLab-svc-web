import Content from "@/layout/Content";

import { useDesktopHeader } from "@/context/headerContext";
import SubHeader from "@/layout/SubHeader";
import BalanceGameList from "@cmp/BalanceGameList";
import FloatingButton from "@cmp/FloatingButton";

const BalanceTemplate = () => {
  const isDesktopHeader = useDesktopHeader();
  return (
    <Content headerProps={{ name: "Balance" }}>
      {!isDesktopHeader && <SubHeader menuNames={["Balance", "Prediction"]} />}
      {<BalanceGameList />}
      <FloatingButton />
    </Content>
  );
};

export default BalanceTemplate;
