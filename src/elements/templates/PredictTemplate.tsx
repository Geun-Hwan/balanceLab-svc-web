import { useDesktopHeader } from "@/context/headerContext";
import Content from "@/layout/Content";
import SubHeader from "@/layout/SubHeader";
import React from "react";

const PredictTemplate = () => {
  const isDesktopHeader = useDesktopHeader();
  return (
    <Content headerProps={{ name: "Prediction" }}>
      {!isDesktopHeader && <SubHeader menuNames={["Balance", "Prediction"]} />}
    </Content>
  );
};

export default PredictTemplate;
