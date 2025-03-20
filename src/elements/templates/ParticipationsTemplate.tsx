import { getParticipationList, getQuestionKey } from "@/api/questionApi";
import { useUserStore } from "@/store/store";
import { Flex, Text } from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import QuestionsList from "../components/QuestionList";

const ParticipationsTemplate = () => {
  const { isLogin } = useUserStore();
  const navigate = useNavigate();
  const result = useInfiniteQuery({
    queryKey: getQuestionKey({ isParticipation: true }),
    queryFn: ({ pageParam }) =>
      getParticipationList({
        page: pageParam,
        pageSize: 30,
      }),

    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) => {
      return !lastPage.last ? lastPage.number + 1 : undefined;
    },
    enabled: isLogin,
  });

  return (
    <Flex h={"100%"} w={"100%"} direction={"column"}>
      <Text size="sm" c="dimmed" mt={"lg"} p={"xs"}>
        최신 참여한 목록이 최상단에 나타납니다.
      </Text>

      <QuestionsList result={result} type="participation" />
    </Flex>
  );
};

export default ParticipationsTemplate;
