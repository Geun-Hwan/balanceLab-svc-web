import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { QueryClientProvider } from "@tanstack/react-query";
import { MotionGlobalConfig } from "framer-motion";
import { useEffect } from "react";
import { queryClient } from "./service/queryClent";
import { useSettingStore } from "./store/store";

import dayjs from "dayjs";
import DesktopViewProvider from "./context/DesktopHeaderProvider";
import AlertComponent from "./elements/components/AlertComponent";
import RouterFactory from "./routes/RouterFactory";

import "dayjs/locale/ko"; // 한국어 로케일 가져오기
import "./App.css";

dayjs.locale("ko");

function App() {
  const { themeColor, animationEnable } = useSettingStore();

  useEffect(() => {
    MotionGlobalConfig.skipAnimations = !animationEnable; // 애니메이션 비활성화
  }, [animationEnable]);

  return (
    <DesktopViewProvider>
      <QueryClientProvider client={queryClient}>
        <MantineProvider
          withCssVariables
          withGlobalClasses
          withStaticClasses
          defaultColorScheme={themeColor}
        >
          <ModalsProvider labels={{ confirm: "확인", cancel: "취소" }}>
            <AlertComponent />
            <RouterFactory />
            {/* <AdsenseAd /> */}
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </DesktopViewProvider>
  );
}
export default App;
