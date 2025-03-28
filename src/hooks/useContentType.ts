import { useDesktopHeader } from "@/context/headerContext";
import { useMediaQuery } from "@mantine/hooks";
import { isMobile } from "react-device-detect";

const useContentType = () => {
  const isDeskTop = useDesktopHeader();
  const isSmall = useMediaQuery("(max-width: 768px)") ?? false;

  const isMidium =
    useMediaQuery("(min-width: 769px) and (max-width: 1024px)") ?? false;
  const isExtra = useMediaQuery("(min-width: 1025px)") ?? false;

  const isExtraAdjusted = isExtra || (isDeskTop && isSmall && isMobile);

  return { isSmall, isMidium, isExtra: isExtraAdjusted };
};

export default useContentType;
