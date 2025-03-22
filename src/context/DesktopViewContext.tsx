import React, { ReactNode, useEffect, useState } from "react";
import { isDesktop, isMobile, isTablet } from "react-device-detect";
import { DesktopViewContext } from ".";
import { useMediaQuery } from "@mantine/hooks";
// isDesktopView 상태를 저장할 컨텍스트를 생성

// useDesktopView 훅

// DesktopViewProvider 컴포넌트
interface DesktopViewProviderProps {
  children: ReactNode; // children 타입 명시
}

const DesktopViewProvider: React.FC<DesktopViewProviderProps> = ({
  children,
}) => {
  const [isDesktopView, setIsDesktopView] = useState(isDesktop);
  const isMobileSize = useMediaQuery("(max-width: 1024px)"); // 모바일 화면에서 true가 됩니다.

  useEffect(() => {
    const userAgent = navigator.userAgent;

    if (isMobile)
      setIsDesktopView(
        userAgent.includes("Macintosh") ||
          userAgent.includes("Windows") ||
          !isMobileSize
      );

    if (isTablet) {
      setIsDesktopView(
        userAgent.includes("Macintosh") || userAgent.includes("Windows")
      );
    }

    if (isDesktop) {
      setIsDesktopView(!isMobileSize);
    }
  }, [isMobileSize]);

  return (
    <DesktopViewContext.Provider value={isDesktopView}>
      {children}
    </DesktopViewContext.Provider>
  );
};

export default DesktopViewProvider;
