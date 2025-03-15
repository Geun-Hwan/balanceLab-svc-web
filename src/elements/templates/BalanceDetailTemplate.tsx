import {
  getQuestionDetail,
  getQuestionKey,
  IQuestionResult,
} from "@/libs/api/questionApi";
import {
  createSelection,
  modifySelection,
  SelectionCreateType,
} from "@/libs/api/selectionApi";
import { useAlertStore, useUserStore } from "@/libs/store/store";
import { QuestionStatusCd } from "@/libs/utils/serviceConstants";
import { Card, Flex, Skeleton, Stack, Text, Title } from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import { useParams } from "react-router-dom";
import MobileSelectAnimation from "../components/mobile/MobileSelectAnimation";
import PcSelectAnimation from "../components/pc/PcSelectAnimation";

const BalanceDetailTemplate = () => {
  const qc = useQueryClient();
  const requestTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { showAlert } = useAlertStore();
  const { isLogin } = useUserStore();
  const { questionId } = useParams();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const lastSelectedOptionRef = useRef<string | null>(null); // 마지막 선택된 옵션 저장

  const [ended, setIsEnded] = useState(false);
  const [count, setCount] = useState<{ a: number; b: number }>({ a: 0, b: 0 });

  const { data, isLoading } = useQuery({
    queryKey: getQuestionKey({ questionId }),
    queryFn: () => getQuestionDetail(questionId as string),
    enabled: isLogin,
  });

  const { mutate: createSelect } = useMutation({
    mutationFn: (params: SelectionCreateType) => createSelection(params),
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

      if (requestTimeout.current) {
        clearTimeout(requestTimeout.current);
      }

      // 1초 뒤에 요청이 없으면 최종 요청 처리
      requestTimeout.current = setTimeout(() => {
        if (data?.choiceType !== id) {
          modifySelect({
            choiceType: id as "A" | "B",
            questionId: data?.questionId as string,
          });
        }
      }, 1000); // 1초 지연
    }
    lastSelectedOptionRef.current = id;
    setSelectedOption(id);
    setCount({ a, b });
  };

  const getRatio = (target: number): number => {
    const total = count.a + count.b;

    if (total === 0) {
      return 0;
    }

    return target / total;
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
    return () => {
      if (requestTimeout.current) {
        clearTimeout(requestTimeout.current); // 타이머 취소

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
  }, [qc]);

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
      <Stack p="md" mt={"lg"}>
        <Title order={3} ta="center">
          {data?.title}
        </Title>
        {/* ㅇ선택지 버튼 */}

        <Card
          h={100}
          pt={0}
          m={"auto"}
          bg={selectedOption === "A" ? "cyan" : undefined}
          style={{
            cursor:
              data?.questionStatusCd === QuestionStatusCd.END
                ? "not-allowed"
                : "pointer",
          }}
          withBorder
          onClick={handleOptionClick}
          role="button"
          maw={500}
          w={"100%"}
          id={"A"}
        >
          <Title ta="center" order={4} m={"auto"}>
            A
          </Title>

          <Text
            size="sm"
            ta="center"
            style={{
              fontWeight: "600",
              whiteSpace: "normal",
            }}
            lineClamp={2}
          >
            {data?.choiceA}
          </Text>
        </Card>

        <Card
          m={"auto"}
          id={"B"}
          h={100}
          pt={0}
          bg={selectedOption === "B" ? "cyan" : undefined}
          style={{
            cursor:
              data?.questionStatusCd === QuestionStatusCd.END
                ? "not-allowed"
                : "pointer",
          }}
          withBorder
          role="button"
          onClick={handleOptionClick}
          maw={500}
          w={"100%"}
        >
          <Title ta="center" order={4} m={"auto"}>
            B
          </Title>

          <Text
            size="sm"
            ta="center"
            style={{
              fontWeight: "600",
              whiteSpace: "normal",
            }}
            lineClamp={2}
          >
            {data?.choiceB}
          </Text>
        </Card>
        <BrowserView>
          <PcSelectAnimation
            isSelect={!!selectedOption || ended}
            label="A"
            ratio={getRatio(count.a)}
            color={highlightColorA}
            h={50}
          />
          <PcSelectAnimation
            isSelect={!!selectedOption || ended}
            label="B"
            ratio={getRatio(count.b)}
            color={highlightColorB}
            h={50}
          />
        </BrowserView>

        {
          <MobileView>
            <Flex gap={"xl"} justify={"center"} mt={"md"}>
              <MobileSelectAnimation
                isSelect={!!selectedOption || ended}
                label="A"
                ratio={getRatio(count.a)}
                color={highlightColorA}
              />
              <MobileSelectAnimation
                isSelect={!!selectedOption || ended}
                label="B"
                ratio={getRatio(count.b)}
                color={highlightColorB}
              />
            </Flex>
          </MobileView>
        }
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
