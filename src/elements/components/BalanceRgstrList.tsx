import { CategoryValue, QuestionStatusCd } from "@/constants/ServiceConstants";
import {
  getMyQuestionList,
  getQuestionKey,
  IQuestionResult,
  removeQuestion,
} from "@/service/questionApi";
import { useAlertStore, useUserStore } from "@/store/store";
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
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useNavigate } from "react-router-dom";
import BalanceCreateModal from "./BalanceCreateModal";

import MyGamesTemplate from "../templates/MyGamesTemplate";
import SelectAnimation from "./SelectAnimation";
import { getCategoryName } from "@/utils/balance";

const BalanceRgstrList = () => {
  const { isLogin, userData } = useUserStore();
  const { showAlert } = useAlertStore();
  const [modalData, setModalData] = useState<IQuestionResult | undefined>(
    undefined
  );
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: getQuestionKey({ isMine: true }),
      queryFn: ({ pageParam }) =>
        getMyQuestionList({
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
    mutationFn: (questionId: string) => removeQuestion(questionId),
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

  const handleEdit = (question: IQuestionResult) => {
    // 수정 기능 구현
    const { questionStatusCd, delYn } = question;

    if (questionStatusCd === QuestionStatusCd.PROGRESS) {
      showAlert("수정 가능한 기간이 아닙니다.", "warning");
      return;
    }
    if (delYn) {
      showAlert("이미 삭제된 항목입니다.", "warning");
      return;
    }

    flushSync(() => {
      setModalData(question); // 상태 업데이트를 동기적으로 처리
      open();
    });
  };

  const handleClose = () => {
    setModalData(undefined);
    close();
  };

  const handleDelete = (question: IQuestionResult) => {
    // 삭제 기능 구현
    const { questionStatusCd, delYn, questionId } = question;
    if (questionStatusCd === QuestionStatusCd.PROGRESS) {
      showAlert("삭제 가능한 기간이 아닙니다.", "warning");
      return;
    }

    if (delYn) {
      if (userData?.userId !== "SYSTEM") {
        showAlert("이미 삭제된 항목입니다.", "warning");
        return;
      }
    }

    modals.openConfirmModal({
      title: "게임 삭제",
      centered: true,
      children: (
        <Text>삭제된 항목은 복구할 수 없습니다. 계속 진행하시겠습니까?</Text>
      ),
      labels: { confirm: "삭제", cancel: "취소" },
      confirmProps: { color: "red", disabled: isPending },
      onConfirm: () => remove(questionId),
    });
  };

  const handleView = (data: IQuestionResult) => {
    // 상세보기
    navigate(`/balance/${data.questionId}`);
  };

  if (data?.pages[0].totalElements === 0) {
    return <MyGamesTemplate.Nodata text={"생성한 밸런스 게임이 없습니다."} />;
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
                delYn={question.delYn}
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

              <BalanceRgstrList.Content item={question} />

              <MyGamesTemplate.CardFooter
                id={question.questionId}
                data={question}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                leftSlot={<BalanceRgstrList.TimeFormat item={question} />}
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
        <BalanceCreateModal
          opened={opened}
          close={handleClose}
          data={modalData}
          isModify={true}
        />
      )}
    </Stack>
  );
};

BalanceRgstrList.TimeFormat = ({ item }: { item: IQuestionResult }) => {
  const timeFomrat = `${dayjs(item.strDate).format("YYYY-MM-DD")} ~ ${dayjs(
    item.endDate
  )
    .endOf("day")
    .format("YYYY-MM-DD HH:mm")}`;

  return (
    <Flex direction={"column"}>
      <Text size="sm">참여기간</Text>
      <Text size="xs" c="dimmed">
        {timeFomrat}
      </Text>
    </Flex>
  );
};

BalanceRgstrList.Content = ({ item }: { item: IQuestionResult }) => {
  const getPercent = (question: IQuestionResult, target: "A" | "B"): number => {
    const { selectA, selectB } = question;
    const total = selectA + selectB;

    if (total === 0) {
      return 0;
    }

    return ((target === "A" ? selectA : selectB) / total) * 100;
  };

  return (
    <Flex mt={"lg"} gap={"sm"}>
      <Card flex={1} radius={4} withBorder p="xs" pos={"relative"}>
        <SelectAnimation
          duration={0.1}
          isSelect={true}
          color="red"
          percent={getPercent(item, "A")}
        />
        <Text
          pos={"relative"}
          fw={500}
          size="sm"
          style={{
            wordBreak: "break-word",
          }}
          lineClamp={1}
        >
          A: {item.choiceA}
        </Text>
        <Text size="xs" mt={5} pos={"relative"}>
          {item.selectA}명 선택
        </Text>
      </Card>
      <Card flex={1} radius={4} p="xs" pos={"relative"} withBorder>
        <SelectAnimation
          duration={0.1}
          isSelect={true}
          color="blue"
          percent={getPercent(item, "B")}
        />

        <Text
          fw={500}
          size="sm"
          style={{
            wordBreak: "break-word",
          }}
          lineClamp={1}
          pos={"relative"}
        >
          B: {item.choiceB}
        </Text>
        <Text size="xs" mt={5} pos={"relative"}>
          {item.selectB}명 선택
        </Text>
      </Card>
    </Flex>
  );
};

export default BalanceRgstrList;
