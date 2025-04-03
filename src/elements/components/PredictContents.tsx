import { useDesktopHeader } from "@/context/headerContext";
import useContentType from "@/hooks/useContentType";
import { useUserStore } from "@/store/store";
import DummyComponent from "@cmp/DummyComponent";
import PredictCard from "@cmp/PredictCard";
import { Box, Flex, Loader, SimpleGrid } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

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

const PredictContents = () => {
  const isDesktopHeader = useDesktopHeader();
  const [colSize, setColsize] = useState(3);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <Flex w={"100%"} direction={"column"}>
      <Box mt={"xl"}>
        {loading ? (
          <DummyComponent cols={colSize} type="predict" isLoading={true} />
        ) : (
          <SimpleGrid cols={colSize} spacing={50}>
            {mockGames.map((game, i) => {
              return <PredictCard data={game} key={i} />;
            })}
          </SimpleGrid>
        )}
      </Box>
      <Box ref={observerRef} bg={"transparent"} h={30} />

      <Flex justify={"center"}>{false && <Loader size={"xl"} />}</Flex>
    </Flex>
  );
};

export default PredictContents;
