import { getMyQuestionList, getQuestionKey } from "@/api/questionApi";
import { useUserStore } from "@/store/store";
import { Button, Flex, Group, Text } from "@mantine/core";
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
    getNextPageParam: (lastPage, allPages) => {
      return !lastPage.last ? lastPage.number + 1 : undefined;
    },
    enabled: isLogin,
  });

  return (
    <Flex h={"100%"} w={"100%"} direction={"column"}>
      <Group justify="space-between" mb="lg" mt={"lg"} wrap="wrap" p={"xs"}>
        <Text size="sm" c="dimmed">
          대기 중인 질문만 수정·삭제할 수 있으며, 매일 자정에 시작 상태로
          변경됩니다.
        </Text>
        <Button leftSection={<IconPlus size={16} />} onClick={open}>
          질문 만들기
        </Button>
      </Group>

      <QuestionsList result={result} type="manageMent" />
      <BalanceCreateModal opened={opened} close={close} />
    </Flex>
  );
};

export default MyGamesTemplate;
