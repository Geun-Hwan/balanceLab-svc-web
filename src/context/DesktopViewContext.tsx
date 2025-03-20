import React, { ReactNode, useEffect, useState } from "react";
import { DesktopViewContext } from ".";

// isDesktopView 상태를 저장할 컨텍스트를 생성

// useDesktopView 훅

// DesktopViewProvider 컴포넌트
interface DesktopViewProviderProps {
  children: ReactNode; // children 타입 명시
}

const DesktopViewProvider: React.FC<DesktopViewProviderProps> = ({
  children,
}) => {
  const [isDesktopView, setIsDesktopView] = useState(false);

  useEffect(() => {
    const checkDeviceView = () => {
      const isDesktop = window.innerWidth >= 1024; // 화면 너비가 1024px 이상이면 데스크탑
      const userAgent = navigator.userAgent;

      // 데스크탑 웹사이트 보기 감지: 화면 크기와 userAgent를 함께 체크
      if (
        isDesktop ||
        userAgent.includes("Macintosh") ||
        userAgent.includes("Windows")
      ) {
        setIsDesktopView(true); // 데스크탑 뷰로 설정
      } else {
        setIsDesktopView(false); // 모바일 뷰로 설정
      }
    };

    // 페이지 로드 시 한 번 체크
    checkDeviceView();

    // 윈도우 크기 변경 시 체크
    window.addEventListener("resize", checkDeviceView);

    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    return () => {
      window.removeEventListener("resize", checkDeviceView);
    };
  }, []);

  return (
    <DesktopViewContext.Provider value={isDesktopView}>
      {children}
    </DesktopViewContext.Provider>
  );
};

export default DesktopViewProvider;
