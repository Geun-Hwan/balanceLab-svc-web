import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import "dayjs/locale/ko"; // 한국어 로케일 임포트
import RouterFactory from "./RouterFactory";
import AlertComponent from "./elements/components/AlertComponent";
import { queryClient } from "./libs/queryClent";
import { useUserStore } from "./libs/store/store";
import { MotionGlobalConfig } from "framer-motion";
import { useEffect } from "react";

function App() {
  const { themeColor, animationEnable } = useUserStore();

  useEffect(() => {
    MotionGlobalConfig.skipAnimations = !animationEnable; // 애니메이션 비활성화
  }, [animationEnable]);

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        withCssVariables
        withGlobalClasses
        withStaticClasses
        defaultColorScheme={themeColor}
      >
        <AlertComponent />

        <RouterFactory />
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
