import { useDesktopHeader } from "@/context/headerContext";
import Content from "@/layout/Content";
import { useAlertStore, useUserStore } from "@/store/store";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";

const PredictDetailTemplate = () => {
  const qc = useQueryClient();

  const isDesktopView = useDesktopHeader();

  const { showAlert } = useAlertStore();
  const { isLogin } = useUserStore();

  const { predictId } = useParams();

  return <Content></Content>;
};

export default PredictDetailTemplate;
