import { Flex } from "@mantine/core";
import { ReactNode } from "react";
import { MenuName } from "../hooks/useGetMenuItems";
import Footer from "./Footer";
import Header from "./Header";

type HeaderProps = {
  name?: MenuName;
  isVisible?: boolean;
};

type FooterProps = {
  isVisible?: boolean;
};
const Content = ({
  children,
  headerProps,
  footerProps,
}: {
  children?: ReactNode;
  headerProps?: HeaderProps;
  footerProps?: FooterProps;
}) => {
  return (
    <Flex direction={"column"} flex={1} mx={"auto"} w={"100%"}>
      <Content.Header {...headerProps} />

      {children}
      <Content.Footer {...footerProps} />
    </Flex>
  );
};

Content.Header = ({ name, isVisible = true }: HeaderProps) => {
  if (!isVisible) {
    return null;
  }

  return <Header name={name} />;
};
Content.Footer = ({ isVisible }: FooterProps) => {
  if (!isVisible) {
    return null;
  }
  return <Footer />;
};

export default Content;
