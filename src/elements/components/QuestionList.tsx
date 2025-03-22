import {
  getQuestionKey,
  IQuestionResult,
  PageResponse,
  removeQuestion,
} from "@/api/questionApi";
import { CATEGORIES, QuestionStatusCd } from "@/constants/serviceConstants";
import { useAlertStore } from "@/store/store";
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
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import {
  InfiniteData,
  InfiniteQueryObserverBaseResult,
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

type ScreenType = "manageMent" | "participation";

const QuestionsList = ({
  result,
  type,
  children,
}: {
  children?: ReactNode;
  type: ScreenType;
  result?: InfiniteQueryObserverBaseResult<
    InfiniteData<PageResponse<IQuestionResult>>
  >;
}) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    result || {};
  const { showAlert } = useAlertStore();
  const [modalData, setModalData] = useState<IQuestionResult | undefined>(
    undefined
  );
  const qc = useQueryClient();
  const navigate = useNavigate();

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
  const getStatusBadge = (statusCd: string) => {
    switch (statusCd) {
      case "20000001":
        return <Badge color="green">진행 중</Badge>;
      case "20000002":
        return <Badge color="blue">완료됨</Badge>;
      case "20000003":
        return <Badge color="yellow">대기 중</Badge>;
      default:
        return <Badge color="gray">알 수 없음</Badge>;
    }
  };

  const getCategoryName = (categoryCd: string) => {
    const category = CATEGORIES.find((cat) => cat.value === categoryCd);
    return category ? category.label : "기타";
  };

  const handleEdit = (question: IQuestionResult) => {
    // 수정 기능 구현
    flushSync(() => {
      setModalData(question); // 상태 업데이트를 동기적으로 처리
      open();
    });
  };

  const handleClose = () => {
    setModalData(undefined);
    close();
  };

  const handleDelete = (questionId: string) => {
    // 삭제 기능 구현
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

  const handleView = (questionId: string) => {
    // 상세보기
    navigate(`/balance/${questionId}`);
  };

  const renderActionIcons = (question: IQuestionResult) => {
    const buttons: JSX.Element[] = [];

    const { questionId, questionStatusCd, delYn } = question;

    buttons.push(
      <ActionIcon
        variant="light"
        onClick={() => handleView(question.questionId)}
        key={`view-${questionId}`}
      >
        <IconEye size={16} />
      </ActionIcon>
    );

    if (delYn || type === "participation") {
      return buttons;
    }

    if (questionStatusCd === QuestionStatusCd.WAITING) {
      buttons.push(
        <ActionIcon
          variant="light"
          color="blue"
          onClick={() => handleEdit(question)}
          key={`edit-${questionId}`}
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
          onClick={() => handleDelete(questionId)}
          key={`delete-${questionId}`}
        >
          <IconTrash size={16} />
        </ActionIcon>
      );
    }
    return buttons;
  };

  return (
    <Stack gap="md" w={"100%"}>
      {children}
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
                    {question.delYn && type === "manageMent" && (
                      <Badge color="red">삭제됨</Badge>
                    )}

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

              <QuestionsList.Content type={type} item={question} />

              <QuestionsList.Footer type={type} item={question}>
                {renderActionIcons(question)}
              </QuestionsList.Footer>
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
      {opened && type === "manageMent" && (
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

QuestionsList.Content = ({
  type,
  item,
}: {
  type: ScreenType;
  item: IQuestionResult;
}) => {
  const getPercent = (question: IQuestionResult, target: "A" | "B"): number => {
    const { selectA, selectB } = question;
    const total = selectA + selectB;

    if (total === 0) {
      return 0;
    }

    return ((target === "A" ? selectA : selectB) / total) * 100;
  };

  if (type === "manageMent") {
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
  }

  if (type === "participation") {
    return (
      <Flex mt={"lg"} gap={"sm"}>
        <Card
          flex={1}
          radius={4}
          withBorder
          p="xs"
          pos={"relative"}
          bg={item.choiceType === "A" ? "cyan" : undefined}
        >
          <Text
            pos={"relative"}
            fw={500}
            size="sm"
            style={{
              wordBreak: "break-word",
            }}
            lineClamp={1}
          >
            {item.choiceA}
          </Text>
        </Card>
        <Card
          flex={1}
          radius={4}
          p="xs"
          pos={"relative"}
          withBorder
          bg={item.choiceType === "B" ? "cyan" : undefined}
        >
          <Text
            fw={500}
            size="sm"
            style={{
              wordBreak: "break-word",
            }}
            lineClamp={1}
            pos={"relative"}
          >
            {item.choiceB}
          </Text>
        </Card>
      </Flex>
    );
  }

  return <Flex mt={"lg"} gap={"sm"}></Flex>;
};

QuestionsList.Footer = ({
  type,
  item,
  children,
}: {
  type: ScreenType;
  item: IQuestionResult;
  children: ReactNode;
}) => {
  let timeFomrat = "-";

  if (type === "manageMent") {
    timeFomrat = `${dayjs(item.strDate).format("YYYY-MM-DD")} ~ ${dayjs(
      item.endDate
    ).format("YYYY-MM-DD")}`;
  }

  if (type === "participation") {
    timeFomrat = `참여일: ${dayjs(item.participationDtm).format(
      "YYYY-MM-DD hh:mm"
    )}`;
  }
  return (
    <Flex justify="space-between" align="center" mt={"lg"}>
      <Text size="xs" c="dimmed">
        {timeFomrat}
      </Text>

      <Group>{children}</Group>
    </Flex>
  );
};
QuestionsList.NoData = ({ type }: { type: ScreenType }) => {
  let text = "데이터가 없습니다.";

  if (type === "manageMent") {
    text = "생성한 질문이 없습니다.";
  }

  if (type === "participation") {
    text = "참여한 목록이 없습니다.";
  }

  return (
    <Box p="md">
      <Title ta="center" fw={500} mt="xl" c="dimmed" order={3}>
        {text}{" "}
      </Title>
    </Box>
  );
};

export default QuestionsList;
