import { useDesktopHeader } from "@/context/headerContext";
import { ActionIcon } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const FloatingButton = () => {
  const isDesktop = useDesktopHeader();
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [showButton, setShowButton] = useState(false); // 버튼 보이기 여부 상태
  const [scrollTimeout, setScrollTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout); // 기존 타이머를 지운다
      }

      if (window.scrollY > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }

      // 스크롤이 멈춘 후 2초 뒤에 버튼 숨기기
      const timeout = setTimeout(() => {
        setShowButton(false); // 2초 후 버튼 숨기기
      }, 5000); // 2초 (2000ms)

      setScrollTimeout(timeout); // 새로운 타이머 설정
    };

    // 스크롤 이벤트 리스너 추가
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트가 언마운트될 때 이벤트 리스너 정리
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout); // 컴포넌트 언마운트 시 타이머 정리
      }
    };
  }, [scrollTimeout]);
  return (
    <AnimatePresence>
      {showButton && (
        <motion.div
          transition={{ duration: 0.3, ease: "easeInOut" }} // 애니메이션 지속 시간
          initial={{ opacity: 0 }} // 시작 상태: 왼쪽에서 오기
          animate={{ opacity: 1, scale: 1 }} // 애니메이션 중: 투명도 1, 크기 정상
          exit={{ opacity: 0 }}
        >
          <ActionIcon
            pos={"fixed"}
            w={50}
            h={50}
            bottom={isDesktop ? 30 : 15}
            radius={200}
            right={isDesktop ? 50 : 20}
            onClick={handleScrollToTop}
          >
            <IconArrowUp aria-label="Scroll to top" size={30} />
          </ActionIcon>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingButton;
