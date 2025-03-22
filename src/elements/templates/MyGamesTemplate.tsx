import { getMyQuestionList, getQuestionKey } from "@/api/questionApi";
import Content from "@/layout/Content";
import { useUserStore } from "@/store/store";
import { Button, Group, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import BalanceCreateModal from "../components/BalanceCreateModal";
import QuestionsList from "../components/QuestionList";

/** @TODO 1일1회 출석체크 포인트 */

const MyGamesTemplate = () => {
  const { isLogin } = useUserStore();
  const [opened, { open, close }] = useDisclosure(false);

  const result = useInfiniteQuery({
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

  return (
    <Content>
      <QuestionsList result={result} type="manageMent">
        <Group justify="space-between" mb="lg" p={"xs"} flex={1} w={"100%"}>
          <Text size="sm" c="dimmed">
            대기 중인 질문만 수정·삭제할 수 있으며, 매일 자정에 시작 상태로
            변경됩니다.
          </Text>
          <Button leftSection={<IconPlus size={16} />} onClick={open}>
            게임 생성
          </Button>
        </Group>
      </QuestionsList>

      <BalanceCreateModal opened={opened} close={close} />
    </Content>
  );
};

export default MyGamesTemplate;
