import { CATEGORIES, QuestionStatusCd } from "@/constants/ServiceConstants";
import {
  getMyQuestionList,
  getQuestionKey,
  IQuestionResult,
  removeQuestion,
} from "@/service/questionApi";
import { useAlertStore, useUserStore } from "@/store/store";
import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Flex,
  Group,
  Loader,
  Progress,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import { JSX } from "react/jsx-runtime";
import BalanceCreateModal from "./BalanceCreateModal";
import SelectAnimation from "./SelectAnimation";
import {
  getMyPredictionList,
  getPredictionKey,
  IPredictResult,
  removePredict,
} from "@/service/predictApi";
import PredictCreateModal from "./PredictCreateModal";

const PredictRgstrList = ({
  getStatusBadge,
}: {
  getStatusBadge: (stusCd: string, predict?: boolean) => any;
}) => {
  const { isLogin } = useUserStore();
  const { showAlert } = useAlertStore();
  const [modalData, setModalData] = useState<IPredictResult | undefined>(
    undefined
  );
  const qc = useQueryClient();
  const navigate = useNavigate();

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
    flushSync(() => {
      setModalData(predict); // 상태 업데이트를 동기적으로 처리
      open();
    });
  };

  const handleClose = () => {
    setModalData(undefined);
    close();
  };

  const handleDelete = (predictId: string) => {
    // 삭제 기능 구현
    modals.openConfirmModal({
      title: "게임 삭제",
      centered: true,
      children: (
        <Text>삭제된 항목은 복구할 수 없습니다. 계속 진행하시겠습니까?</Text>
      ),
      labels: { confirm: "삭제", cancel: "취소" },
      confirmProps: { color: "red", disabled: isPending },
      onConfirm: () => remove(predictId),
      lockScroll: false,
    });
  };

  const handleView = (predictId: string) => {
    // 상세보기
    navigate(`/predict/${predictId}`);
  };

  const renderActionIcons = (predict: IPredictResult) => {
    const buttons: JSX.Element[] = [];

    const { predictId, questionStatusCd, delYn } = predict;

    buttons.push(
      <ActionIcon
        variant="light"
        onClick={() => handleView(predictId)}
        key={`view-${predictId}`}
      >
        <IconEye size={16} />
      </ActionIcon>
    );

    if (delYn) {
      return buttons;
    }

    if (questionStatusCd === QuestionStatusCd.WAITING) {
      buttons.push(
        <ActionIcon
          variant="light"
          color="blue"
          onClick={() => handleEdit(predict)}
          key={`edit-${predictId}`}
        >
          <IconEdit size={16} />
        </ActionIcon>
      );
    }

    if (
      questionStatusCd === QuestionStatusCd.WAITING ||
      questionStatusCd === QuestionStatusCd.END
    ) {
      buttons.push(
        <ActionIcon
          variant="light"
          color="red"
          onClick={() => handleDelete(predictId)}
          key={`delete-${predictId}`}
        >
          <IconTrash size={16} />
        </ActionIcon>
      );
    }
    return buttons;
  };

  if (data?.pages[0].totalElements === 0) {
    return <PredictRgstrList.NoData />;
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
              mih={400}
              mah={400}
            >
              <Card.Section p="md" withBorder>
                <Group justify="space-between">
                  <Group>
                    {predcit.delYn && <Badge color="red">삭제됨</Badge>}

                    {getStatusBadge(predcit.questionStatusCd, true)}
                  </Group>
                </Group>
              </Card.Section>

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

              <PredictRgstrList.Footer item={predcit}>
                {renderActionIcons(predcit)}
              </PredictRgstrList.Footer>
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
          data={modalData}
          isModify={true}
        />
      )}
    </Stack>
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
  } = item;
  const total = countA + countB + countC;

  const calculatePercentage = (count: number) => {
    if (total == 0) {
      return 0; // 전체 합이 0일 경우, 비율은 0%
    }
    return (count / total) * 100; // 비율 계산
  };

  return (
    <Flex direction={"column"}>
      <Box>
        <Text fw={900} ta={"left"} flex={1} lineClamp={1}>
          {optionA}
        </Text>

        <Flex direction={"row"} align={"center"}>
          <Progress
            value={calculatePercentage(countA)}
            animated
            h={"lg"}
            flex={1}
          />
          <Stack gap={0} miw={100}>
            <Text ml={"sm"} fw={700} c={"blue"} ta={"right"}>
              {countA}명
            </Text>
            <Text ml={"sm"} fw={700} ta={"right"}>
              {sumPointA.toLocaleString()}P
            </Text>
          </Stack>
        </Flex>
      </Box>
      <Box>
        <Text fw={900} ta={"left"} flex={1} lineClamp={1}>
          {optionB}
        </Text>

        <Flex direction={"row"} align={"center"}>
          <Progress
            value={calculatePercentage(countB)}
            animated
            h={"lg"}
            flex={1}
          />
          <Stack gap={0} miw={100}>
            <Text ml={"sm"} fw={700} c={"blue"} ta={"right"}>
              {countB}명
            </Text>
            <Text ml={"sm"} fw={700} ta={"right"}>
              {sumPointB.toLocaleString()}P
            </Text>
          </Stack>
        </Flex>
      </Box>
      {optionC && (
        <Box>
          <Text fw={900} ta={"left"} flex={1} lineClamp={1}>
            {optionC}
          </Text>

          <Flex direction={"row"} align={"center"}>
            <Progress
              value={calculatePercentage(countC)}
              animated
              h={"lg"}
              flex={1}
            />
            <Stack gap={0} miw={100}>
              <Text ml={"sm"} fw={700} ta={"right"}>
                {countC}명
              </Text>
              <Text ml={"sm"} fw={700} ta={"right"} c={"blue"}>
                {sumPointC.toLocaleString()}P
              </Text>
            </Stack>
          </Flex>
        </Box>
      )}
    </Flex>
  );
};

PredictRgstrList.Footer = ({
  item,
  children,
}: {
  item: IPredictResult;
  children: ReactNode;
}) => {
  const timeFomrat = `${dayjs(item.strDtm).format(
    "YYYY-MM-DD HH:mm"
  )} ~ ${dayjs(item.endDtm).format("YYYY-MM-DD HH:mm")}`;

  return (
    <Flex justify="space-between" align="center" mt={"lg"}>
      <Text size="xs" c="dimmed">
        {timeFomrat}
      </Text>

      <Group>{children}</Group>
    </Flex>
  );
};
PredictRgstrList.NoData = () => {
  const text = "생성한 예측 게임이 없습니다.";

  return (
    <Box p="md">
      <Title ta="center" fw={500} mt="xl" c="dimmed" order={3}>
        {text}
      </Title>
    </Box>
  );
};

export default PredictRgstrList;
