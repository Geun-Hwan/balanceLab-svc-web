import { BrowserView, MobileView } from "react-device-detect";
import PCBalanceGameList from "../components/pc/PcBalanceGameList";
import BalanceCard from "../components/BalanceCard";
import MobileBalanceGameList from "../components/mobile/MobileBalanceGameList";
import { SimpleGrid, Stack } from "@mantine/core";

const MainHomeTemplate = () => {
  // };
  return (
    <>
      <BrowserView>
        <PCBalanceGameList />
      </BrowserView>

      <MobileView>
        <MobileBalanceGameList />
      </MobileView>
    </>
  );
};

export const DummyData = ({
  repeat = 12,
  cols = 3,
  spacing = 50,
}: {
  repeat?: number;
  cols?: number;
  spacing?: number;
}) => {
  return (
    <SimpleGrid cols={cols} spacing={spacing}>
      {Array.from({ length: repeat }).map((_, index) => (
        <BalanceCard key={index} isBlur />
      ))}{" "}
    </SimpleGrid>
  );
};

export default MainHomeTemplate;
