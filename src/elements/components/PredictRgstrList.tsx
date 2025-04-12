import { QuestionStatusCd } from "@/constants/ServiceConstants";
import {
  getMyPredictionList,
  getPredictionKey,
  IPredictResult,
  removePredict,
} from "@/service/predictApi";
import { getQuestionKey } from "@/service/questionApi";
import { useAlertStore, useUserStore } from "@/store/store";
import { calculatePercentage } from "@/utils/predict";
import {
  Box,
  Card,
  Flex,
  Group,
  Loader,
  Progress,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { MyGamesTemplate } from "@tmp";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import PredictCreateModal from "./PredictCreateModal";
import PredictResultSelectModal from "./PredictResultSelectModal";
import PredictBetMadal from "./PredictBetMadal";
const PredictRgstrList = () => {
  const { isLogin, userData } = useUserStore();
  const { showAlert } = useAlertStore();
  const [modalData, setModalData] = useState<IPredictResult | undefined>(
    undefined
  );

  const [viewModalData, setViewModalData] = useState<
    IPredictResult | undefined
  >(undefined);
  const qc = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: getPredictionKey({ isMine: true }),
      queryFn: ({ pageParam }) =>
        getMyPredictionList({
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
    mutationFn: (questionId: string) => removePredict(questionId),
    onMutate: () => {},
    onSuccess: (data) => {
      if (data > 0) {
        qc.invalidateQueries({ queryKey: getQuestionKey({ isMine: true }) });
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

  const [viewOpened, { open: viewOpen, close: viewClose }] =
    useDisclosure(false);

  const handleViewClose = () => {
    setViewModalData(undefined);
    viewClose();
  };
  const handleView = (data: IPredictResult) => {
    flushSync(() => {
      setViewModalData(data); // 상태 업데이트를 동기적으로 처리
      viewOpen();
    });
  };

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

  const handleEdit = (predict: IPredictResult) => {
    // 수정 기능 구현
    const { questionStatusCd, delYn } = predict;

    if (userData?.userId !== "SYSTEM") {
      if (
        questionStatusCd === QuestionStatusCd.PROGRESS ||
        questionStatusCd === QuestionStatusCd.END
      ) {
        showAlert("수정 가능한 기간이 아닙니다.", "warning");
        return;
      }
      if (delYn) {
        showAlert("이미 삭제된 항목입니다.", "warning");
        return;
      }
    }

    flushSync(() => {
      setModalData(predict); // 상태 업데이트를 동기적으로 처리
      open();
    });
  };

  const handleClose = () => {
    setModalData(undefined);
    close();
  };

  const handleDelete = (predict: IPredictResult) => {
    // 삭제 기능 구현
    const { questionStatusCd, delYn, predictId } = predict;
    if (
      questionStatusCd === QuestionStatusCd.PROGRESS ||
      questionStatusCd === QuestionStatusCd.END
    ) {
      showAlert("삭제 가능한 기간이 아닙니다.", "warning");
      return;
    }
    if (delYn) {
      showAlert("이미 삭제된 항목입니다.", "warning");
      return;
    }

    modals.openConfirmModal({
      title: "게임 삭제",
      centered: true,
      children: (
        <Text>삭제된 항목은 복구할 수 없습니다. 계속 진행하시겠습니까?</Text>
      ),
      labels: { confirm: "삭제", cancel: "취소" },
      confirmProps: { color: "red", disabled: isPending },
      onConfirm: () => remove(predictId),
    });
  };

  if (data?.pages[0].totalElements === 0) {
    return <MyGamesTemplate.Nodata text="생성한 예측 게임이 없습니다." />;
  }

  return (
    <Stack w={"100%"}>
      {data?.pages.map((page, pageIndex) => (
        <React.Fragment key={pageIndex}>
          {page.content.map((predcit) => (
            <Card
              key={predcit.predictId}
              shadow="sm"
              withBorder
              w={"100%"}
              mih={420}
            >
              <MyGamesTemplate.CardHeaderSection
                statusCd={predcit.questionStatusCd}
                delYn={predcit.delYn}
              >
                <Group mah={"100$"}>
                  <PredictResultSelectModal data={predcit} />
                  {predcit.winner && (
                    <Text fz="sm" fw={"bolder"}>
                      예측결과 :{predcit.winner}
                    </Text>
                  )}
                </Group>
              </MyGamesTemplate.CardHeaderSection>

              <Text
                my={"sm"}
                fw={700}
                fz="xl"
                lineClamp={1}
                style={{ wordBreak: "break-word" }}
              >
                {predcit.title}
              </Text>

              <PredictRgstrList.Content item={predcit} />

              <MyGamesTemplate.CardFooter
                id={predcit.predictId}
                data={predcit}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                leftSlot={<PredictRgstrList.TimeForamt item={predcit} />}
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
        <PredictCreateModal
          opened={opened}
          close={handleClose}
          data={modalData as IPredictResult}
          isModify={true}
        />
      )}
      {viewOpened && (
        <PredictBetMadal
          opened={viewOpened}
          close={handleViewClose}
          data={viewModalData as IPredictResult}
        />
      )}
    </Stack>
  );
};

interface OptionProgressProps {
  label: string;
  count: number;
  sumPoint: number;
  percentage: number;
}

const OptionProgress = ({
  label,
  count,
  sumPoint,
  percentage,
}: OptionProgressProps) => {
  return (
    <Box>
      <Text fw={900} ta="left" flex={1} lineClamp={1}>
        {label}
      </Text>
      <Progress value={percentage} animated h="lg" />

      <Flex direction="row" align="center" justify={"space-between"}>
        <Flex>
          <Text fw={700} ta="right" c="blue">
            {count}명
          </Text>
          {<Text>({percentage}%)</Text>}
        </Flex>
        <Text ml="sm" fw={700} ta="right">
          {sumPoint.toLocaleString()}P
        </Text>
      </Flex>
    </Box>
  );
};

PredictRgstrList.Content = ({ item }: { item: IPredictResult }) => {
  const {
    optionA,
    optionB,
    optionC,
    countA,
    countB,
    countC,
    sumPointA,
    sumPointB,
    sumPointC,
    predictId,
  } = item;

  return (
    <Flex direction={"column"} my={"auto"} gap={optionC ? 3 : "lg"}>
      <OptionProgress
        key={`${predictId}_A`}
        label={optionA}
        count={countA}
        sumPoint={sumPointA}
        percentage={calculatePercentage(item, countA)}
      />
      <OptionProgress
        key={`${predictId}_B`}
        label={optionB}
        count={countB}
        sumPoint={sumPointB}
        percentage={calculatePercentage(item, countB)}
      />
      {optionC && (
        <OptionProgress
          key={`${predictId}_C`}
          label={optionC}
          count={countC}
          sumPoint={sumPointC}
          percentage={calculatePercentage(item, countC)}
        />
      )}
    </Flex>
  );
};

PredictRgstrList.TimeForamt = ({ item }: { item: IPredictResult }) => {
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

export default PredictRgstrList;
