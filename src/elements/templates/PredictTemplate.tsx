import { useDesktopHeader } from "@/context/headerContext";
import useContentType from "@/hooks/useContentType";
import Content from "@/layout/Content";
import SubHeader from "@/layout/SubHeader";
import { useUserStore } from "@/store/store";
import BalanceCard from "@cmp/BalanceCard";
import DummyComponent from "@cmp/DummyComponent";
import PredictCard from "@cmp/PredictCard";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Loader,
  Progress,
  SimpleGrid,
  Skeleton,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const mockGames = [
  {
    id: 1,
    title: "2026년 월드컵 우승국가는?",
    status: "진행 중",
    choiceA: "브라질",
    choiceB: "프랑스",
    percentageA: 60,
    percentageB: 40,
    pointsA: 600,
    pointsB: 400,
  },
  {
    id: 2,
    title: "2024년 마감 기준 비트코인 가격",
    status: "종료됨",
    choiceA: "100000$ up",
    choiceB: "100000$ down",
    percentageA: 10,
    percentageB: 90,
    pointsA: 100,
    pointsB: 450,
  },
  {
    id: 3,
    title: "2025년 가장 많이 팔린 자동차 브랜드는?",
    status: "진행 중",
    choiceA: "현대",
    choiceB: "테슬라",
    percentageA: 70,
    percentageB: 30,
    pointsA: 700,
    pointsB: 300,
  },
];

const PredictTemplate = () => {
  const isDesktopHeader = useDesktopHeader();
  const [colSize, setColsize] = useState(3);
  const loading = false;
  const { isLogin } = useUserStore();
  const { isExtra, isMidium, isSmall } = useContentType();
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isExtra) {
      setColsize(3);
      return;
    } else if (isMidium) {
      setColsize(2);
      return;
    } else if (isSmall) {
      setColsize(1);
      return;
    }
  }, [isSmall, isMidium, isExtra]);

  return (
    <Content headerProps={{ name: "Prediction" }}>
      {!isDesktopHeader && <SubHeader menuNames={["Balance", "Prediction"]} />}
      <Flex w={"100%"} direction={"column"}>
        <Box mt={"xl"}>
          {isLogin ? (
            <SimpleGrid cols={colSize} spacing={50}>
              {loading
                ? Array.from({ length: colSize * 3 }).map((_, index) => {
                    return (
                      <Skeleton visible={loading} key={`'skel'-${index}`}>
                        <PredictCard key={index} isBlur />
                      </Skeleton>
                    );
                  })
                : mockGames.map((game) => {
                    return <PredictCard data={game} />;
                  })}
            </SimpleGrid>
          ) : (
            <DummyComponent cols={colSize} type="predict" />
          )}
        </Box>
        <Box ref={observerRef} bg={"transparent"} h={30} />

        <Flex justify={"center"}>{false && <Loader size={"xl"} />}</Flex>
      </Flex>
    </Content>
  );
};

export default PredictTemplate;
