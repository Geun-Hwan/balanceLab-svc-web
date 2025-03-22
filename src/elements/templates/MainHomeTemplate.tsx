import { useDesktopHeader } from "@/context/headerContext";
import Content from "@/layout/Content";
import Header from "@/layout/Header";

const MainHomeTemplate = () => {
  // };
  const isDesktopView = useDesktopHeader();

  return (
    <Content>
      {isDesktopView ? MainHomeTemplate.DeskTop : <MainHomeTemplate.Mobile />}
    </Content>
  );
};

MainHomeTemplate.DeskTop = null;

MainHomeTemplate.Mobile = () => {
  return (
    <>
      <Header.MobileSubHeader />
    </>
  );
};

export default MainHomeTemplate;
