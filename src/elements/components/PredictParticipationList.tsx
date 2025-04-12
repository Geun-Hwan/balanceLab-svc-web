import { QuestionStatusCd } from "@/constants/ServiceConstants";
import {
  getPredictionKey,
  getPredictParticipationList,
  IPredictResult,
  removePredictParticipation,
} from "@/service/predictApi";
import { useAlertStore, useUserStore } from "@/store/store";
import { Box, Card, Flex, Loader, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { MyGamesTemplate } from "@tmp";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import PredictBetMadal from "./PredictBetMadal";
import { modals } from "@mantine/modals";

const PredictParticipationList = () => {
  const { isLogin, userData } = useUserStore();
  const { showAlert } = useAlertStore();

  const qc = useQueryClient();
  const [modalData, setModalData] = useState<IPredictResult | undefined>(
    undefined
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: getPredictionKey({ isParticipation: true }),
      queryFn: ({ pageParam }) =>
        getPredictParticipationList({
          page: pageParam,
          pageSize: 10,
        }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, _allPages) => {
        return !lastPage.last ? lastPage.number + 1 : undefined;
      },
      enabled: isLogin,
    });

  const { mutate: remove, isPending } = useMutation({
    mutationFn: (questionId: string) => removePredictParticipation(questionId),
    onMutate: () => {},
    onSuccess: (data) => {
      if (data > 0) {
        qc.invalidateQueries({
          queryKey: getPredictionKey({ isParticipation: true }),
        });
        qc.invalidateQueries({
          queryKey: getPredictionKey({ isMine: true }),
        });
        showAlert("성공적으로 삭제되었습니다.", "success");
      } else {
        showAlert("삭제 가능한 기간이 아닙니다.", "warning");
      }
    },
    onError: () => {
      showAlert("오류가 발생했습니다.\n잠시후 다시 시도해주세요.", "error");

      // 에러 처리 (로그 등)
    },
  });

  const [opened, { open, close }] = useDisclosure(false);

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

  const handleClose = () => {
    setModalData(undefined);
    close();
  };
  const handleView = (data: IPredictResult) => {
    flushSync(() => {
      setModalData(data); // 상태 업데이트를 동기적으로 처리
      open();
    });
  };

  if (data?.pages[0].totalElements === 0) {
    return <MyGamesTemplate.Nodata text="예측 내역이 존재하지 않습니다." />;
  }

  const handleDelete =
    userData?.userId === "SYSTEM"
      ? (data: IPredictResult) => {
          modals.openConfirmModal({
            title: "게임 삭제",
            centered: true,
            children: (
              <Text>
                삭제된 항목은 복구할 수 없습니다. 계속 진행하시겠습니까?
              </Text>
            ),
            labels: { confirm: "삭제", cancel: "취소" },
            confirmProps: { color: "red", disabled: isPending },
            onConfirm: () => remove(data.predictId),
          });
        }
      : undefined;

  return (
    <Stack w={"100%"}>
      {data?.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page.content.map((predict) => (
            <Card
              key={predict.predictId}
              shadow="sm"
              withBorder
              w={"100%"}
              mih={240}
              mah={250}
            >
              <MyGamesTemplate.CardHeaderSection
                statusCd={predict.questionStatusCd}
              >
                {predict.winner && (
                  <Text fz="sm" fw={"bolder"}>
                    {predict.winner === predict.choiceType
                      ? "예측성공"
                      : "예측실패"}
                  </Text>
                )}
              </MyGamesTemplate.CardHeaderSection>

              <Text
                my={"sm"}
                fw={700}
                fz="xl"
                lineClamp={1}
                style={{ wordBreak: "break-word" }}
              >
                {predict.title}
              </Text>

              <PredictParticipationList.Content item={predict} />

              <MyGamesTemplate.CardFooter
                id={predict.predictId}
                data={predict}
                onView={handleView}
                onDelete={handleDelete}
                leftSlot={
                  <PredictParticipationList.TimeForamt item={predict} />
                }
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
      {opened && (
        <PredictBetMadal
          opened={opened}
          close={handleClose}
          data={modalData as IPredictResult}
        />
      )}
    </Stack>
  );
};

interface MyParticipationInfoProps {
  label: string;
  choiceType: "A" | "B" | "C";
  betPoint: number;
  rewardPoint?: number;
  odds: number;
  questionStatusCd?: QuestionStatusCd;
  winner?: "A" | "B" | "C" | null;
}

const MyParticipationInfo = ({
  label,
  betPoint,
  choiceType,
  rewardPoint = 0,
  odds,
  questionStatusCd,
  winner,
}: MyParticipationInfoProps) => {
  const getBetStatus = () => {
    if (winner) {
      if (winner === choiceType) {
        if (questionStatusCd === QuestionStatusCd.COMPLETE) {
          return (
            <Text fw={"bolder"} c="blue">
              {`${rewardPoint.toLocaleString()}P`}
            </Text>
          );
        } else if (questionStatusCd === QuestionStatusCd.END) {
          <Text fw={"bolder"}>포인트 지급중</Text>;
        }
      } else {
        return (
          <Text fw={"bolder"} c={"red"}>
            예측 실패
          </Text>
        );
      }
    } else {
      return <Text fw={"bolder"}>예측 진행중</Text>;
    }
  };

  return (
    <Flex direction={"column"}>
      <Text fw={700}>내 선택: {label}</Text>
      <Flex mt="xs" direction="row" gap="xs">
        <Flex>
          배팅한 포인트:
          <Text c="blue" fw={"bold"}>
            {betPoint.toLocaleString()}P
          </Text>
        </Flex>
        <Flex>
          선택 배당률:
          <Text c="blue" fw={"bold"}>
            {odds}
          </Text>
          배
        </Flex>
        <Flex>
          받은 포인트:
          {getBetStatus()}
        </Flex>
      </Flex>
    </Flex>
  );
};

PredictParticipationList.Content = ({ item }: { item: IPredictResult }) => {
  const {
    optionA,
    optionB,
    optionC,
    predictId,
    payoutA,
    payoutB,
    payoutC,
    choiceType,
    betPoint = 0,
    rewardPoint,
    questionStatusCd,
    winner,
  } = item;

  const getOptionAndPayout = () => {
    const data = {
      betPoint,
      rewardPoint,
      odds: 1.5,
      label: "",
      questionStatusCd,
      choiceType,
      winner,
    };

    switch (choiceType) {
      case "A":
        data.label = optionA;
        data.odds = payoutA as number;
        return data;

      case "B":
        data.label = optionB;
        data.odds = payoutB as number;
        return data;

      default:
        data.label = optionC || "";
        data.odds = payoutC as number;
        return data;
    }
  };

  return <MyParticipationInfo key={predictId} {...getOptionAndPayout()} />;
};

PredictParticipationList.TimeForamt = ({ item }: { item: IPredictResult }) => {
  const timeFomrat = `${dayjs(item.strDtm).format(
    "YYYY-MM-DD HH:mm"
  )} ~ ${dayjs(item.endDtm).format("YYYY-MM-DD HH:mm")}`;

  return (
    <Flex direction={"column"}>
      <Text size="sm">예측기간</Text>
      <Text size="xs" c="dimmed">
        {timeFomrat}
      </Text>
    </Flex>
  );
};

export default PredictParticipationList;
