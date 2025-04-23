import useContentType from "@/hooks/useContentType";
import { getRankList, getTodayQuestion } from "@/service/publicApi";
import { IQuestionResult } from "@/service/questionApi";
import { Carousel } from "@mantine/carousel";
import { Box, Card, Flex, Skeleton, Text } from "@mantine/core";
import { useQueries } from "@tanstack/react-query";
import BalanceCard from "./BalanceCard";
import DragHint from "./DragHint";
import { getBalanceDummyData } from "../../utils/dummy";
import { EmblaCarouselType } from "embla-carousel-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

const MainContents = () => {
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

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="오늘의 추천 게임부터 실시간 인기, 주간·월간 랭킹까지! 지금 가장 핫한 밸런스 질문들을 만나보세요."
        />

        <meta
          property="og:description"
          content="재미있는 선택이 넘치는 공간! 실시간 인기 게임으로 친구들과 고민을 나눠보세요."
        />
        <meta property="og:url" content="https://gugunan.ddns.net" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Flex direction="column" gap={"lg"} py={"lg"}>
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
    </>
  );
};

export default MainContents;

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
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | null>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const getSlideSize = () => {
    if (isExtra) {
      return 33.33333333;
    }

    if (isMidium) {
      return 50;
    }
    if (isSmall) {
      return 100;
    }

    return 100;
  };

  useEffect(() => {
    if (!emblaApi) return;

    const updateScroll = () => {
      const selected = emblaApi.selectedScrollSnap();
      const total = emblaApi.scrollSnapList().length;

      const slideSizePercent = getSlideSize(); // "33.3333%" → 33.3333
      const visibleCount = Math.floor(100 / slideSizePercent);

      // 👉 전체 길이가 한 화면에 다 들어오면 화살표 전부 숨김
      if (total <= visibleCount) {
        setCanScrollPrev(false);
        setCanScrollNext(false);
        return;
      }

      const isAtStart = selected <= 0;
      const isAtEnd = selected >= total - visibleCount;

      setCanScrollPrev(isAtStart);

      setCanScrollNext(isAtEnd);
    };
    const startScroll = () => {
      setCanScrollPrev(false);
      setCanScrollNext(false);
    };

    updateScroll();
    emblaApi.on("pointerDown", startScroll);
    emblaApi.on("pointerUp", updateScroll);

    return () => {
      emblaApi.off("pointerDown", startScroll);
      emblaApi.off("pointerUp", updateScroll);
    };
  }, [emblaApi]);
  if (isLoading) {
    return (
      <Box pos={"relative"}>
        <Text size="lg" fw={700} mb="md">
          {title}
        </Text>

        <Skeleton visible={isLoading}>
          <BalanceCard data={getBalanceDummyData()} isBlur />
        </Skeleton>
      </Box>
    );
  }

  if (!data || (data.length === 0 && !isLoading)) {
    return (
      <Box pos={"relative"}>
        <Text size="lg" fw={700} mb="md">
          {title}
        </Text>
        <Card
          shadow="sm"
          padding="lg"
          radius={8}
          mb={20}
          withBorder
          variant="light"
          h={220}
          mah={220}
          p="md"
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

      <Box pos={"relative"}>
        <Carousel
          align="start"
          slideGap={{ base: "md" }}
          dragFree
          withControls={false}
          slideSize={`${getSlideSize()}%`}
          containScroll="keepSnaps"
          getEmblaApi={setEmblaApi}
        >
          {data?.map((question, i) => (
            <Carousel.Slide key={`${sliderKey}-${i}`}>
              <BalanceCard
                data={question}
                // 추가 props 전달
              />
            </Carousel.Slide>
          ))}
        </Carousel>
        {<DragHint atLeftEnd={canScrollPrev} atRightEnd={canScrollNext} />}
      </Box>
    </Box>
  );
};
