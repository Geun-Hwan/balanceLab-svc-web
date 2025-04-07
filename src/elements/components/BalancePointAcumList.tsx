import { CATEGORIES } from "@/constants/ServiceConstants";
import {
  getParticipationList,
  getQuestionKey,
  IQuestionResult,
} from "@/service/questionApi";
import { useUserStore } from "@/store/store";
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Flex,
  Group,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { ReactNode, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { JSX } from "react/jsx-runtime";

const BalancePointAcumList = ({
  getStatusBadge,
}: {
  getStatusBadge: (stusCd: string) => any;
}) => {
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

  const getCategoryName = (categoryCd: string) => {
    const category = CATEGORIES.find((cat) => cat.value === categoryCd);
    return category ? category.label : "기타";
  };

  const handleView = (questionId: string) => {
    // 상세보기
    navigate(`/balance/${questionId}`);
  };

  const renderActionIcons = (question: IQuestionResult) => {
    const buttons: JSX.Element[] = [];

    const { questionId } = question;

    buttons.push(
      <ActionIcon
        variant="light"
        onClick={() => handleView(question.questionId)}
        key={`view-${questionId}`}
      >
        <IconEye size={16} />
      </ActionIcon>
    );

    return buttons;
  };

  if (data?.pages[0].totalElements === 0) {
    return <BalancePointAcumList.NoData />;
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
              <Card.Section p="md" withBorder>
                <Group justify="space-between">
                  <Group>
                    {question.delYn && <Badge color="red">삭제됨</Badge>}

                    {getStatusBadge(question.questionStatusCd)}
                  </Group>
                  <Text fz="sm" c="dimmed">
                    {getCategoryName(question.categoryCd)}
                  </Text>
                </Group>
              </Card.Section>

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

              <BalancePointAcumList.Footer item={question}>
                {renderActionIcons(question)}
              </BalancePointAcumList.Footer>
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

BalancePointAcumList.Footer = ({
  item,
  children,
}: {
  item: IQuestionResult;
  children: ReactNode;
}) => {
  const timeFomrat = `획득일: ${dayjs(item.participationDtm).format(
    "YYYY-MM-DD hh:mm"
  )}`;

  return (
    <Flex justify="space-between" align="center" mt={"lg"}>
      <Text size="xs" c="dimmed">
        {timeFomrat}
      </Text>

      <Group>{children}</Group>
    </Flex>
  );
};
BalancePointAcumList.NoData = () => {
  const text = "포인트를 획득한 기록이 없습니다.";

  return (
    <Box p="md">
      <Title ta="center" fw={500} mt="xl" c="dimmed" order={3}>
        {text}
      </Title>
    </Box>
  );
};

export default BalancePointAcumList;
