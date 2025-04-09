import {
  getParticipationList,
  getQuestionKey,
  IQuestionResult,
} from "@/service/questionApi";
import { useUserStore } from "@/store/store";
import {
  Badge,
  Box,
  Card,
  Flex,
  Group,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MyGamesTemplate from "../templates/MyGamesTemplate";
import { CategoryValue } from "@/constants/ServiceConstants";
import { getCategoryName } from "@/utils/balance";

const BalancePointAcumList = () => {
  const { isLogin } = useUserStore();

  const navigate = useNavigate();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: getQuestionKey({ isParticipation: true }),
      queryFn: ({ pageParam }) =>
        getParticipationList({
          page: pageParam,
          pageSize: 10,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, _allPages) => {
        return !lastPage.last ? lastPage.number + 1 : undefined;
      },
      enabled: isLogin,
    });
  const observerRef = useRef(null);

  useEffect(() => {
    if (!observerRef.current) return;

    const currentRef = observerRef.current; // ref 값을 변수에 저장

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          if (fetchNextPage) {
            fetchNextPage();
          }
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleView = (data: IQuestionResult) => {
    // 상세보기
    navigate(`/balance/${data.questionId}`);
  };

  if (data?.pages[0].totalElements === 0) {
    return <MyGamesTemplate.Nodata text="포인트를 획득한 기록이 없습니다." />;
  }

  return (
    <Stack gap="md" w={"100%"}>
      {data?.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page.content.map((question) => (
            <Card
              key={question.questionId}
              shadow="sm"
              p="md"
              radius="md"
              withBorder
              w={"100%"}
            >
              <MyGamesTemplate.CardHeaderSection
                statusCd={question.questionStatusCd}
              >
                <Text fz="sm" c="dimmed">
                  {getCategoryName(question.categoryCd as CategoryValue)}
                </Text>
              </MyGamesTemplate.CardHeaderSection>

              <Group justify="flex-start" mt="md" flex={1}>
                <Text
                  fw={500}
                  fz="lg"
                  lineClamp={1}
                  style={{ flex: 1, wordBreak: "break-word" }}
                >
                  {question.title}
                </Text>
                {question.point > 0 && (
                  <Badge color="cyan">{question.point ?? 0}p</Badge>
                )}
              </Group>

              <Flex mt={"lg"} gap={"sm"}></Flex>

              <MyGamesTemplate.CardFooter
                id={question.questionId}
                data={question}
                onView={handleView}
                leftSlot={<BalancePointAcumList.TimeFormat item={question} />}
              />
            </Card>
          ))}
        </React.Fragment>
      ))}
      <Box ref={observerRef} bg={"transparent"} h={30} />

      {(isFetchingNextPage || isLoading) && (
        <Flex justify={"center"}>
          <Loader size={"xl"} />
        </Flex>
      )}
    </Stack>
  );
};

BalancePointAcumList.TimeFormat = ({ item }: { item: IQuestionResult }) => {
  const timeFomrat = `${dayjs(item.participationDtm).format(
    "YYYY-MM-DD hh:mm"
  )}`;

  return (
    <Flex direction={"column"}>
      <Text size="sm">획득일</Text>

      <Text size="xs" c="dimmed">
        {timeFomrat}
      </Text>
    </Flex>
  );
};

export default BalancePointAcumList;
