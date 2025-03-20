import {
  getQuestionDetail,
  getQuestionKey,
  IQuestionResult,
} from "@/api/questionApi";
import {
  createSelection,
  modifySelection,
  SelectionCreateType,
} from "@/api/selectionApi";
import { QuestionStatusCd } from "@/constants/serviceConstants";

import { useAlertStore, useUserStore } from "@/store/store";
import {
  Box,
  Card,
  Flex,
  Group,
  Image,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import SelectAnimation from "../components/SelectAnimation";

import { getUserKey } from "@/api/userApi";
import { debounce } from "lodash";
import { BrowserView, MobileView } from "react-device-detect";
import { useDesktopView } from "@/context";

const BalanceDetailTemplate = () => {
  const qc = useQueryClient();
  const requestTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDesktopView = useDesktopView();

  const { showAlert } = useAlertStore();
  const { isLogin } = useUserStore();
  const { questionId } = useParams();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const lastSelectedOptionRef = useRef<string | null>(null); // 마지막 선택된 옵션 저장

  const [ended, setIsEnded] = useState(false);
  const [count, setCount] = useState<{ a: number; b: number }>({ a: 0, b: 0 });

  const { data, isLoading, error } = useQuery({
    queryKey: getQuestionKey({ questionId }),
    queryFn: () => getQuestionDetail(questionId as string),
    enabled: isLogin,
  });

  const debouncedModifySelect = useCallback(
    debounce((id) => {
      if (data?.choiceType !== id) {
        modifySelect({
          choiceType: id as "A" | "B",
          questionId: data?.questionId as string,
        });
      }
    }, 500), // 500ms 후에 호출
    [data]
  );

  const { mutate: createSelect } = useMutation({
    mutationFn: (params: SelectionCreateType) => createSelection(params),
    onMutate: (variables) => {
      const previousState: IQuestionResult = qc.getQueryData(
        getQuestionKey({ questionId })
      ) as IQuestionResult;

      return { previousState };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getUserKey({ totalPoint: true }) });
      qc.invalidateQueries({ queryKey: getQuestionKey({ questionId }) });
    },
    onError: (error, variables, context) => {
      // 에러가 발생하면, 이전 상태로 되돌립니다.
      showAlert("오류가 발생했습니다.\n잠시후 다시 시도해주세요.", "error");

      if (context?.previousState) {
        const { selectA: a, selectB: b } = context.previousState;
        setSelectedOption(null);
        setCount({ a, b });
      }

      // 에러 처리 (로그 등)
    },
  });

  const { mutate: modifySelect } = useMutation({
    mutationFn: (params: SelectionCreateType) => modifySelection(params),
    onMutate: (variables) => {
      const previousState: IQuestionResult = qc.getQueryData(
        getQuestionKey({ questionId })
      ) as IQuestionResult;

      return { previousState };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getQuestionKey({ questionId }) });
    },
    onError: (error, variables, context) => {
      // 에러가 발생하면, 이전 상태로 되돌립니다.

      showAlert("오류 반복시 문의해주세요.", "error");
      if (context?.previousState) {
        const { choiceType, selectA: a, selectB: b } = context.previousState;
        setSelectedOption(choiceType);
        setCount({ a, b });
      }

      // 에러 처리 (로그 등)
    },
  });

  const handleOptionClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (data?.questionStatusCd === QuestionStatusCd.WAITING) {
      return;
    }

    const { id } = e.currentTarget;

    if (ended) {
      return;
    }

    if (selectedOption === id) {
      return;
    }
    let { a, b } = count;

    if (!selectedOption && !data?.choiceType) {
      a += id === "A" ? 1 : 0;
      b += id === "B" ? 1 : 0;
      createSelect({
        rewardPoint: data?.point as number,
        choiceType: id as "A" | "B",
        questionId: data?.questionId as string,
      });
    } else {
      // 응답 수정 연속 호출 막기 연속으로 3회? 정도 안하면 됨

      a += id === "A" ? 1 : -1;
      b += id === "B" ? 1 : -1;

      setSelectedOption(id);

      debouncedModifySelect(id);
    }
    lastSelectedOptionRef.current = id;
    setSelectedOption(id);
    setCount({ a, b });
  };

  const getPercent = (target: number): number => {
    const total = count.a + count.b;

    if (total === 0) {
      return 0;
    }

    return (target / total) * 100;
  };

  useEffect(() => {
    if (data) {
      if (data?.questionStatusCd === QuestionStatusCd.END) {
        setIsEnded(true);
      }

      setCount({ a: data.selectA, b: data.selectB });
      setSelectedOption(data.choiceType);
    }
  }, [data]);

  useEffect(() => {
    const timeoutId = requestTimeout.current; // 지역 변수에 저장

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // 타이머 취소

        // 선택된 옵션과 data의 choiceType이 다르면 강제로 요청 실행
        if (
          data?.choiceType !== lastSelectedOptionRef.current &&
          !!lastSelectedOptionRef.current
        ) {
          modifySelect({
            choiceType: lastSelectedOptionRef.current as "A" | "B",
            questionId: questionId as string,
          });
        }
      }
      lastSelectedOptionRef.current = null;
      qc.invalidateQueries({ queryKey: getQuestionKey() });
    };
  }, [questionId]);

  if (data?.questionStatusCd === QuestionStatusCd.WAITING) {
    return (
      <Flex justify={"center"} align={"center"} h={"100%"}>
        <Title>시작 대기중입니다.</Title>
      </Flex>
    );
  }

  const highlightColorA = selectedOption
    ? selectedOption === "A"
      ? "cyan"
      : "gray"
    : ended
    ? count.a > count.b
      ? "cyan"
      : "gray" // 종료 후 A가 더 크면 cyan
    : "gray";

  const highlightColorB = selectedOption
    ? selectedOption === "B"
      ? "cyan"
      : "gray"
    : ended
    ? count.b > count.a
      ? "cyan"
      : "gray" // 종료 후 B가 더 크면 cyan
    : "gray";

  // 비율 계산

  return (
    <Skeleton visible={isLoading} mt={"lg"}>
      <Text
        mt={"xl"}
        h={100}
        size="xl"
        ta="center"
        style={{
          fontWeight: "900",
          wordBreak: "break-word",
        }}
        lineClamp={3}
      >
        {data?.title}
      </Text>

      <BrowserView>
        <Group justify="center">
          <Box>
            <Title ta={"center"} mb={"sm"}>
              A
            </Title>
            <Image w={200} h={200} src={"/"}></Image>
          </Box>
          <Box>
            <Title ta={"center"} mb={"sm"}>
              B
            </Title>
            <Image w={200} h={200} src={"/"}></Image>
          </Box>
        </Group>
      </BrowserView>

      <MobileView>
        {isDesktopView ? (
          <Group justify="center">
            <Box>
              <Title ta={"center"} mb={"sm"}>
                A
              </Title>
              <Image w={200} h={200} src={"/"}></Image>
            </Box>
            <Box>
              <Title ta={"center"} mb={"sm"}>
                B
              </Title>
              <Image w={200} h={200} src={"/"}></Image>
            </Box>
          </Group>
        ) : (
          <Group justify="center">
            <Box>
              <Title ta={"center"} mb={"sm"}>
                A
              </Title>
              <Image w={120} h={120} src={"/"}></Image>
            </Box>
            <Box>
              <Title ta={"center"} mb={"sm"}>
                B
              </Title>
              <Image w={120} h={120} src={"/"}></Image>
            </Box>
          </Group>
        )}
      </MobileView>

      <Stack p="md" mt={"lg"} align="center">
        <Card
          h={100}
          style={{
            cursor:
              data?.questionStatusCd === QuestionStatusCd.END
                ? "not-allowed"
                : "pointer",
          }}
          withBorder
          onClick={handleOptionClick}
          role="button"
          maw={600}
          w={"100%"}
          id={"A"}
        >
          <SelectAnimation
            isSelect={!!selectedOption || ended}
            percent={getPercent(count.a)}
            color={highlightColorA}
          />
          <Title ta="center" order={4} style={{ zIndex: 3 }}>
            A
          </Title>

          <Text
            m={"auto"}
            size="sm"
            ta="center"
            style={{
              fontWeight: "600",
              wordBreak: "break-word",
              zIndex: 3,
            }}
            lineClamp={2}
          >
            {data?.choiceA}
          </Text>
        </Card>

        <Card
          id={"B"}
          h={100}
          style={{
            cursor:
              data?.questionStatusCd === QuestionStatusCd.END
                ? "not-allowed"
                : "pointer",
          }}
          withBorder
          role="button"
          onClick={handleOptionClick}
          maw={600}
          w={"100%"}
        >
          <SelectAnimation
            isSelect={!!selectedOption || ended}
            percent={getPercent(count.b)}
            color={highlightColorB}
          />
          <Title ta="center" order={4} style={{ zIndex: 3 }}>
            B
          </Title>

          <Text
            m={"auto"}
            size="sm"
            ta="center"
            style={{
              wordBreak: "break-word",
              fontWeight: "600",

              zIndex: 3,
            }}
            lineClamp={2}
          >
            {data?.choiceB}
          </Text>
        </Card>
      </Stack>
      {ended && (
        <Title ta="center" order={1}>
          종료되었습니다.
        </Title>
      )}
    </Skeleton>
  );
};

export default BalanceDetailTemplate;
