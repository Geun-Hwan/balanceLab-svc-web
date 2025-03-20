import { Box, Container, Flex } from "@mantine/core";
import { ReactNode } from "react";
import Footer from "./Footer";
import Header, { MenuName } from "./Header";

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
    <Flex flex={1} direction={"column"}>
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
