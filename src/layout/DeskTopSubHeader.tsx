import { PcMenuName, useGetMenuItems } from "@/hooks/useGetMenuItems";
import { Menu } from "@mantine/core";
import React from "react";

const DeskTopSubHeader = ({ menuNames }: { menuNames?: PcMenuName[] }) => {
  const MainItems = useGetMenuItems(true, menuNames);
  return (
    <Menu>
      {Object.entries(MainItems).map(([key, Component]) => (
        <Component key={key} />
      ))}
    </Menu>
  );
};

export default DeskTopSubHeader;
