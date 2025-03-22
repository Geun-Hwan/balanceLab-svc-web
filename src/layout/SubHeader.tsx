import { ScrollArea, Flex } from "@mantine/core";
import { MobileMenuName, useGetMenuItems } from "../hooks/useGetMenuItems";
import { useDesktopHeader } from "@/context/headerContext";

const SubHeader = ({ menuNames }: { menuNames?: MobileMenuName[] }) => {
  const isDesktopHeader = useDesktopHeader();
  const MainItems = useGetMenuItems(isDesktopHeader as boolean, menuNames);

  return (
    <ScrollArea w="90dvw" type="never" mt={"md"} h={"100%"}>
      <Flex gap={"sm"} py={"xs"}>
        {Object.entries(MainItems).map(([key, Component]) => (
          <Component key={key} />
        ))}
      </Flex>
    </ScrollArea>
  );
};

export default SubHeader;
