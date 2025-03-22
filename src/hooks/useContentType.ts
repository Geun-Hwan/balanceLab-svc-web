import { useMediaQuery } from "@mantine/hooks";

const useContentType = () => {
  const isSmall = useMediaQuery("(max-width: 768px)") ?? false;

  const isMidium =
    useMediaQuery("(min-width: 769px) and (max-width: 1024px)") ?? false;
  const isExtra = useMediaQuery("(min-width: 1025px)") ?? false;

  return { isSmall, isMidium, isExtra };
};

export default useContentType;
