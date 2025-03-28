import { useDesktopHeader } from "@/context/headerContext";
import Content from "@/layout/Content";
import SubHeader from "@/layout/SubHeader";
import { useAlertStore, useUserStore } from "@/store/store";
import { Carousel } from "@mantine/carousel";
import { Box, Card, Flex, SimpleGrid, Skeleton, Text } from "@mantine/core";

import { getRankList, getTodayQuestion } from "@/api/publicApi";
import { IQuestionResult } from "@/api/questionApi";
import useContentType from "@/hooks/useContentType";
import BalanceCard from "@cmp/BalanceCard";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getDummyData } from "../components/dummy";

const MainHomeTemplate = () => {
  // };
  const qc = useQueryClient();

  const { showAlert } = useAlertStore();

  const isDesktopHeader = useDesktopHeader();

  const queries = useQueries({
    queries: [
      {
        queryKey: ["public", "today"],
        queryFn: getTodayQuestion,
      },
      {
        queryKey: ["public", "rank", "daily"],
        queryFn: () => getRankList("daily"), // 예시: getRank()와 같은 다른 API 호출 함수
      },
      {
        queryKey: ["public", "rank", "weekly"],
        queryFn: () => getRankList("weekly"), // 예시: getRank()와 같은 다른 API 호출 함수
        staleTime: 1000 * 60 * 60,
      },
      {
        queryKey: ["public", "rank", "monthly"],
        queryFn: () => getRankList("monthly"), // 예시: getRank()와 같은 다른 API 호출 함수
        staleTime: 1000 * 60 * 60,
      },
    ],
  });

  useEffect(() => {
    const message = localStorage.getItem("showPopup");
    if (message) {
      localStorage.removeItem("showPopup");

      showAlert(message);
      qc.clear();
    }
  }, []);

  return (
    <Content headerProps={{ name: "Home" }} footerProps={{ isVisible: true }}>
      {!isDesktopHeader && <MainHomeTemplate.Mobile />}

      <Flex direction="column" gap={"lg"} pt={"lg"}>
        <BalanceCardSlider
          sliderKey={"today"}
          title="오늘의 밸런스 게임"
          data={queries[0].data}
          isLoading={queries[0].isLoading}
          noDataText="오늘의 밸런스게임 생성전입니다."
        />
        <BalanceCardSlider
          sliderKey={"daily"}
          title="실시간 인기 TOP3"
          data={queries[1].data}
          isLoading={queries[0].isLoading}
          noDataText="실시간 랭킹 집계중"
        />

        <BalanceCardSlider
          sliderKey={"weekly"}
          title="주간 인기 TOP3"
          data={queries[2].data}
          isLoading={queries[2].isLoading}
          noDataText="주간 랭킹 집계중"
        />
        <BalanceCardSlider
          sliderKey={"monthly"}
          title="월간 인기 TOP3"
          data={queries[3].data}
          isLoading={queries[3].isLoading}
          noDataText="월간 랭킹 집계중"
        />
      </Flex>
    </Content>
  );
};

MainHomeTemplate.Mobile = () => {
  return <SubHeader menuNames={["Balance", "Prediction"]} />;
};

const BalanceCardSlider = ({
  title,
  data,
  isLoading,
  sliderKey,
  noDataText = "데이터가 존재하지 않습니다.",
}: {
  title: string;
  data?: IQuestionResult[];
  isLoading: boolean;
  sliderKey: string;
  noDataText?: string;
}) => {
  const { isExtra, isMidium, isSmall } = useContentType();
  const { isLogin } = useUserStore();
  const getSlideSize = () => {
    if (isExtra) {
      return "33.33333333%";
    }

    if (isMidium) {
      return "50%";
    }
    if (isSmall) {
      return "100%";
    }
  };

  if (isLoading) {
    return (
      <Box>
        <Text size="lg" fw={700} mb="md">
          {title}
        </Text>

        <Skeleton>
          <BalanceCard data={getDummyData()} isBlur />
        </Skeleton>
      </Box>
    );
  }
  if (!data || (data.length === 0 && !isLoading)) {
    return (
      <Box>
        <Text size="lg" fw={700} mb="md">
          {title}
        </Text>
        <Card
          h={220}
          mah={220}
          miw={300}
          flex={1}
          shadow="sm"
          padding="lg"
          radius={8}
          style={{ justifyContent: "center" }}
        >
          <Text fz="h3" ta="center" fw={"bold"}>
            {noDataText}
          </Text>
        </Card>
      </Box>
    );
  }

  return (
    <Box>
      <Text size="lg" fw={700} mb="md">
        {title}
      </Text>

      {isExtra ? (
        <SimpleGrid cols={3} w={"100%"}>
          {data?.map((question, i) => (
            <BalanceCard
              key={`${sliderKey}-${i}`}
              data={question} // 추가 props 전달
              isBlur={isLogin ? false : i !== 0}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Carousel
          align="start"
          slideGap={{ base: "md" }}
          type="container"
          // controlsOffset="xs"
          loop
          dragFree
          withControls={false}
          slideSize={getSlideSize()}

          // slideSize={"90%"}
        >
          {data?.map((question, i) => (
            <Carousel.Slide key={`${sliderKey}-${i}`}>
              <BalanceCard
                isBlur={isLogin ? false : i !== 0}
                data={question}
                // 추가 props 전달
              />
            </Carousel.Slide>
          ))}
        </Carousel>
      )}
    </Box>
  );
};

export default MainHomeTemplate;
