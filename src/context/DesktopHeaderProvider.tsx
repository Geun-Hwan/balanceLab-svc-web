import { useMediaQuery } from "@mantine/hooks";
import React, { ReactNode, useEffect, useState } from "react";
import { isDesktop, isMobile, isTablet } from "react-device-detect";
import { DesktopHeaderContext } from "./headerContext";
// isDesktopView 상태를 저장할 컨텍스트를 생성

// useDesktopHeader 훅

// DesktopViewProvider 컴포넌트
interface DesktopViewProviderProps {
  children: ReactNode; // children 타입 명시
}

const DesktopHeaderProvider: React.FC<DesktopViewProviderProps> = ({
  children,
}) => {
  const [isDesktopHeader, setIsDesktopHeader] = useState<boolean | undefined>(
    undefined
  );

  const userAgent = navigator.userAgent;
  const isMobileHeader = useMediaQuery("(max-width: 1024px)");
  useEffect(() => {
    if (isMobile || isTablet) {
      setIsDesktopHeader(
        userAgent.includes("Macintosh") || userAgent.includes("Windows")
      );
    } else if (isDesktop) {
      setIsDesktopHeader(!isMobileHeader);
    } else if (!isMobile && !isTablet && !isDesktop) {
      setIsDesktopHeader(!isMobileHeader);
    }
  }, [isMobileHeader]);

  return (
    <DesktopHeaderContext.Provider value={isDesktopHeader}>
      {children}
    </DesktopHeaderContext.Provider>
  );
};

export default DesktopHeaderProvider;
