import {
  getMyQuestionList,
  getParticipationList,
  getQuestionKey,
} from "@api/questionApi";
import Content from "@/layout/Content";
import { useUserStore } from "@/store/store";
import { Button, Group, Tabs, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconGoGame, IconListCheck, IconPlus } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BalanceCreateModal from "../components/BalanceCreateModal";
import QuestionsList from "../components/QuestionList";

type TabType = "#my-rgstr" | "#my-participations";

const MyGamesTemplate = () => {
  const { isLogin } = useUserStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [opened, { open, close }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<TabType>(
    (location.hash as TabType) || "#my-rgstr"
  );

  const myGames = useInfiniteQuery({
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
    enabled: isLogin && activeTab === "#my-rgstr",
  });

  const myParticipation = useInfiniteQuery({
    queryKey: getQuestionKey({ isParticipation: true }),
    queryFn: ({ pageParam }) =>
      getParticipationList({
        page: pageParam,
        pageSize: 10,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages) => {
      return !lastPage.last ? lastPage.number + 1 : undefined;
    },
    enabled: isLogin && activeTab === "#my-participations",
  });

  const handleTapChange = (value: string | null) => {
    setActiveTab(value as TabType);

    navigate(`${value}`, { replace: true });
  };

  return (
    <Content>
      <Group
        justify="space-between"
        mb="lg"
        p={"xs"}
        flex={1}
        w={"100%"}
        wrap="nowrap"
        align="flex-start"
      >
        {activeTab === "#my-rgstr" && MyGamesTemplate.ManagementHeader}
        {activeTab === "#my-participations" &&
          MyGamesTemplate.ParticipationHeader}
        <Button leftSection={<IconPlus size={16} />} onClick={open} miw={110}>
          게임 생성
        </Button>
      </Group>

      <Tabs
        value={activeTab}
        onChange={handleTapChange}
        keepMounted={false}
        activateTabWithKeyboard={false}
      >
        <Tabs.List mb={"md"}>
          <Tabs.Tab value="#my-rgstr" leftSection={<IconGoGame size={14} />}>
            내 게임
          </Tabs.Tab>
          <Tabs.Tab
            value="#my-participations"
            leftSection={<IconListCheck size={14} />}
          >
            참여목록
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="#my-rgstr">
          <QuestionsList result={myGames} type="manageMent" />
        </Tabs.Panel>
        <Tabs.Panel value="#my-participations">
          <QuestionsList result={myParticipation} type="participation" />
        </Tabs.Panel>
      </Tabs>

      <BalanceCreateModal opened={opened} close={close} />
    </Content>
  );
};

MyGamesTemplate.ManagementHeader = (
  <Text size="sm" c="dimmed">
    대기 중인 질문만 수정·삭제할 수 있으며, 매일 자정에 시작 상태로 변경됩니다.
  </Text>
);

MyGamesTemplate.ParticipationHeader = (
  <Text size="sm" c="dimmed">
    최신 참여한 목록이 최상단에 나타납니다.
  </Text>
);

export default MyGamesTemplate;
