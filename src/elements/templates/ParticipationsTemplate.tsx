import { getParticipationList, getQuestionKey } from "@/api/questionApi";
import Content from "@/layout/Content";
import { useUserStore } from "@/store/store";
import { Text } from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import QuestionsList from "../components/QuestionList";

const ParticipationsTemplate = () => {
  const { isLogin } = useUserStore();
  // const navigate = useNavigate();
  const result = useInfiniteQuery({
    queryKey: getQuestionKey({ isParticipation: true }),
    queryFn: ({ pageParam }) =>
      getParticipationList({
        page: pageParam,
        pageSize: 30,
      }),

    initialPageParam: 0,

    getNextPageParam: (lastPage, _allPages) => {
      return !lastPage.last ? lastPage.number + 1 : undefined;
    },
    enabled: isLogin,
  });

  return (
    <Content>
      <QuestionsList result={result} type="participation">
        <Text
          size="sm"
          c="dimmed"
          mt={"lg"}
          p={"xs"}
          w={"100%"}
          flex={1}
          display={"flex"}
        >
          최신 참여한 목록이 최상단에 나타납니다.
        </Text>
      </QuestionsList>
    </Content>
  );
};

export default ParticipationsTemplate;
