import { useMediaQuery } from "@mantine/hooks";

const useContentType = () => {
  const isSmall = useMediaQuery("(max-width: 768px)");

  const isMidium = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const isExtra = useMediaQuery("(min-width: 1025px)");

  return { isSmall, isMidium, isExtra };
};

export default useContentType;
