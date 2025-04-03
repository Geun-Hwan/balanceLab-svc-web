import {
  getQuestionDetail,
  getQuestionKey,
  IQuestionResult,
} from "@/service/questionApi";
import { createSelection, SelectionCreateType } from "@/service/selectionApi";
import { QuestionStatusCd } from "@/constants/ServiceConstants";

import { useAlertStore, useUserStore } from "@/store/store";
import {
  Box,
  Card,
  Group,
  Image,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SelectAnimation from "../components/SelectAnimation";

import { IAPI_RESPONSE } from "@/service/api";
import { getUserKey } from "@/service/userApi";
import { useDesktopHeader } from "@/context/headerContext";
import Content from "@/layout/Content";

import { AxiosResponse } from "axios";

import etcA from "@asset/images/etcA.png";
import etcB from "@asset/images/etcB.png";
import { modals } from "@mantine/modals";

const BalanceDetailTemplate = ({
  isPublic = false,
}: {
  isPublic?: boolean;
}) => {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const isDesktopView = useDesktopHeader();

  const { showAlert } = useAlertStore();
  const { isLogin } = useUserStore();
  const { questionId } = useParams();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const [ended, setIsEnded] = useState(false);
  const [count, setCount] = useState<{ a: number; b: number }>({ a: 0, b: 0 });

  const { data, isLoading, error } = useQuery<
    IQuestionResult,
    AxiosResponse<IAPI_RESPONSE<any>>
  >({
    queryKey: getQuestionKey({ questionId }),
    queryFn: () => getQuestionDetail(questionId as string, isPublic),
    enabled: (isLogin || isPublic) && !!questionId?.startsWith("QST"),
  });

  const { mutate: createSelect } = useMutation({
    mutationFn: (params: SelectionCreateType) => createSelection(params),
    onMutate: () => {
      const previousState: IQuestionResult = qc.getQueryData(
        getQuestionKey({ questionId })
      ) as IQuestionResult;

      return { previousState };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: getUserKey({ totalPoint: true }) });
      qc.invalidateQueries({ queryKey: getQuestionKey({ questionId }) });
      qc.invalidateQueries({ queryKey: ["public"] });
    },
    onError: (_error, _variables, context) => {
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

  const handleOptionClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
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

    if (!isLogin) {
      modals.openConfirmModal({
        modalId: "login_confirm",
        centered: true,
        title: "알림",
        children: <Text>로그인 후에 이용 가능합니다.</Text>,
        labels: { confirm: "로그인하기", cancel: "취소" },
        onConfirm: () => navigate("/login"),
      });
      return;
    }

    let { a, b } = count;

    modals.openConfirmModal({
      modalId: "already_selected",
      centered: true,
      title: "알림",
      children: (
        <Text>
          선택 후에는 수정이 불가능합니다.
          <br /> 선택 항목: <strong>{id}</strong>
        </Text>
      ),
      labels: { confirm: `선택하기`, cancel: "취소" },
      closeOnConfirm: true,

      onConfirm: () => {
        // 확인 버튼 클릭 후 처리할 내용
        // 예를 들어, 아무 작업도 하지 않거나 상태를 리셋하는 등 추가적인 로직을 넣을 수 있음

        if (!selectedOption && !data?.choiceType) {
          a += id === "A" ? 1 : 0;
          b += id === "B" ? 1 : 0;
          createSelect({
            rewardPoint: data?.point as number,
            choiceType: id as "A" | "B",
            questionId: data?.questionId as string,
          });
        }
        setSelectedOption(id);
        setCount({ a, b });
      },
    });
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
    return () => {
      qc.invalidateQueries({ queryKey: getQuestionKey() });
    };
  }, []);

  if (data?.questionStatusCd === QuestionStatusCd.WAITING) {
    return <BalanceDetailTemplate.ErrorView message="시작 대기중입니다." />;
  }

  if (error) {
    return <BalanceDetailTemplate.ErrorView message={error?.data?.message} />;
  }
  if (!questionId?.startsWith("QST")) {
    // 잘못된 questionId를 알림으로 보여줌

    return <BalanceDetailTemplate.ErrorView message="잘못된 접근입니다." />;
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
    <Content>
      <Skeleton visible={isLoading} mt={"lg"} h={"100%"}>
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
        {isDesktopView ? (
          isLoading ? (
            <Box w={200} h={200} />
          ) : (
            <Group justify="center">
              {
                <BalanceDetailTemplate.BalanceImage
                  size={200}
                  type={"A"}
                  imageUrl={data?.imgUrlA}
                />
              }
              {
                <BalanceDetailTemplate.BalanceImage
                  size={200}
                  type={"B"}
                  imageUrl={data?.imgUrlB}
                />
              }
            </Group>
          )
        ) : isLoading ? (
          <Box w={120} h={120} />
        ) : (
          <Group justify="center">
            {
              <BalanceDetailTemplate.BalanceImage
                size={120}
                type={"A"}
                imageUrl={data?.imgUrlA}
              />
            }
            {
              <BalanceDetailTemplate.BalanceImage
                size={120}
                type={"B"}
                imageUrl={data?.imgUrlB}
              />
            }
          </Group>
        )}
        <Stack p="md" mt={"lg"} align="center">
          <Card
            component="button"
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
            disabled={ended || !!data?.choiceType}
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
            component="button"
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
            disabled={ended || !!data?.choiceType}
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
    </Content>
  );
};

const BalanceImage = ({
  imageUrl,
  size,
  type,
}: {
  imageUrl?: string | null;
  size: number;
  type: "A" | "B";
}) => {
  const [load, setLoad] = useState(true);
  const defaultImage = type === "A" ? etcA : etcB;

  const handleImageLoad = () => setLoad(false);
  const handleImageError = () => setLoad(false);

  return (
    <Box>
      <Title ta={"center"} mb={"sm"}>
        {type}
      </Title>
      {load && <Skeleton w={size} h={size} />}

      <Image
        loading="eager"
        w={size}
        h={size}
        src={imageUrl}
        onLoad={handleImageLoad}
        onError={handleImageError}
        fallbackSrc={defaultImage}
        style={{ display: load ? "none" : "block" }} // 로딩 중일 때 이미지 숨기기
      />
    </Box>
  );
};
BalanceDetailTemplate.BalanceImage = BalanceImage;

BalanceDetailTemplate.ErrorView = ({ message }: { message?: string }) => {
  return (
    <Content>
      <Title ta="center" order={2} mx={"auto"} mt={"xl"}>
        {message ?? "알 수 없는 오류가 발생했습니다."}
      </Title>
    </Content>
  );
};

export default BalanceDetailTemplate;
