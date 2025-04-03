import {
  getMyQuestionList,
  getParticipationList,
  getQuestionKey,
} from "@/service/questionApi";
import Content from "@/layout/Content";
import { useUserStore } from "@/store/store";
import { Button, Group, Tabs, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconGoGame, IconListCheck, IconPlus } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BalanceCreateModal from "../components/BalanceCreateModal";
import QuestionsList from "../components/QuestionList";

const validTabs = ["#my-rgstr-balance", "#my-participations"] as const;

const MyGamesTemplate = () => {
  const { isLogin } = useUserStore();
  const location = useLocation();
  const getValidHash = () =>
    (location.hash || "#my-rgstr-balance") as (typeof validTabs)[number];
  const navigate = useNavigate();

  const [opened, { open, close }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<(typeof validTabs)[number]>(
    getValidHash()
  );

  useEffect(() => {
    setActiveTab(getValidHash()); // location.hash 변경 감지 후 상태 업데이트
  }, [location.hash]);

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
    enabled: isLogin && activeTab === validTabs[0],
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
    enabled: isLogin && activeTab === validTabs[1],
  });

  const handleTapChange = (value: string | null) => {
    setActiveTab(value as (typeof validTabs)[number]);

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
        {activeTab === validTabs[0] && MyGamesTemplate.ManagementHeader}
        {activeTab === validTabs[1] && MyGamesTemplate.ParticipationHeader}
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
          <Tabs.Tab value={validTabs[0]} leftSection={<IconGoGame size={14} />}>
            내 게임
          </Tabs.Tab>
          <Tabs.Tab
            value={validTabs[1]}
            leftSection={<IconListCheck size={14} />}
          >
            포인트 내역
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={validTabs[0]}>
          <QuestionsList result={myGames} type="manageMent" />
        </Tabs.Panel>
        <Tabs.Panel value={validTabs[1]}>
          <QuestionsList result={myParticipation} type="participation" />
          <></>
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
    게임 참여로 획득한 포인트는 최초 1회만 지급되며, 최근 내역이 최상단에
    표시됩니다.
  </Text>
);

export default MyGamesTemplate;
