import { useDesktopHeader } from "@/context/headerContext";
import { useMediaQuery } from "@mantine/hooks";
import { isMobile, isTablet } from "react-device-detect";

const useContentType = () => {
  const isDeskTop = useDesktopHeader();
  const isSmall = useMediaQuery("(max-width: 768px)", isMobile);
  const isMidium = useMediaQuery(
    "(min-width: 769px) and (max-width: 1024px)",
    isTablet
  );
  const isExtra = useMediaQuery("(min-width: 1025px)", isDeskTop);

  const isExtraAdjusted = isExtra || (isDeskTop && isSmall && isMobile);

  return { isSmall, isMidium, isExtra: isExtraAdjusted };
};

export default useContentType;
