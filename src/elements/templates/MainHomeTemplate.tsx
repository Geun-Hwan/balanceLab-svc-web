import { BrowserView, MobileView } from "react-device-detect";
import PCBalanceGameList from "../components/pc/PcBalanceGameList";
import BalanceCard from "../components/BalanceCard";
import MobileBalanceGameList from "../components/mobile/MobileBalanceGameList";

const MainHomeTemplate = () => {
  // const { setThemeColor, themeColor } = useUserStore();
  // const { toggleColorScheme } = useMantineColorScheme();

  // const toggleTheme = () => {
  //   toggleColorScheme();
  //   setThemeColor(themeColor === "dark" ? "light" : "dark");
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

export const DummyData = () => {
  return (
    <>
      <BalanceCard key={1} data={{ title: "로그인 후 이용 하세요!" }} isBlur />
      <BalanceCard key={2} data={{ title: "가입 후 이용 하세요!" }} isBlur />

      <BalanceCard key={3} data={{ title: "로그인 후 이용 하세요!2" }} isBlur />

      <BalanceCard key={4} data={{ title: "가입 후 이용 하세요!3" }} isBlur />

      <BalanceCard key={5} data={{ title: "로그인 후 이용 하세요!" }} isBlur />

      <BalanceCard key={6} data={{ title: "로그인 후 이용 하세요!" }} isBlur />
    </>
  );
};

export default MainHomeTemplate;
