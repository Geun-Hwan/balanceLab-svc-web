import { useDesktopView } from "@/context";
import Content from "@/layout/Content";
import Header from "@/layout/Header";

const MainHomeTemplate = () => {
  // };
  const isDesktopView = useDesktopView();

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
