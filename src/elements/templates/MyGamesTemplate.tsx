import Content from "@/layout/Content";
import BalancePointAcumList from "@cmp/BalancePointAcumList";
import PredictCreateModal from "@cmp/PredictCreateModal";
import { Badge, Button, Group, Modal, Stack, Tabs, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDeviceGamepad,
  IconGoGame,
  IconListCheck,
  IconListDetails,
  IconPlus,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BalanceCreateModal from "../components/BalanceCreateModal";
import BalanceRgstrList from "../components/BalanceRgstrList";
import PredictRgstrList from "@cmp/PredictRgstrList";

const validTabs = [
  "#my-rgstr-balance",
  "#my-rgstr-predict",
  "#my-participations",
  "#my-predict-history",
] as const;

const MyGamesTemplate = () => {
  const location = useLocation();
  const getValidHash = () =>
    (location.hash || "#my-rgstr-balance") as (typeof validTabs)[number];
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<(typeof validTabs)[number]>(
    getValidHash()
  );

  useEffect(() => {
    setActiveTab(getValidHash()); // location.hash 변경 감지 후 상태 업데이트
  }, [location.hash]);

  const handleTapChange = (value: string | null) => {
    setActiveTab(value as (typeof validTabs)[number]);

    navigate(`${value}`, { replace: true });
  };

  const getStatusBadge = (statusCd: string, predict?: boolean) => {
    switch (statusCd) {
      case "20000001":
        return <Badge color="green">진행중</Badge>;
      case "20000002":
        return <Badge color="blue">{predict ? "결산중" : "마감됨"}</Badge>;
      case "20000003":
        return <Badge color="yellow">대기중</Badge>;

      case "20000004":
        return <Badge color="yellow">결산완료</Badge>;
      default:
        return <Badge color="gray">알수없음</Badge>;
    }
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
        {(activeTab === validTabs[0] || activeTab === validTabs[1]) &&
          MyGamesTemplate.ManagementHeader}

        {activeTab === validTabs[2] && MyGamesTemplate.ParticipationHeader}
        {activeTab === validTabs[3] &&
          MyGamesTemplate.ParticipationPredictHeader}

        <GameTypeModal />
      </Group>

      <Tabs
        value={activeTab}
        onChange={handleTapChange}
        keepMounted={false}
        activateTabWithKeyboard={false}
      >
        <Tabs.List
          pb={"sm"}
          style={{
            overflowX: "auto",
            whiteSpace: "nowrap",
            flexWrap: "nowrap",
          }}
        >
          <Tabs.Tab value={validTabs[0]} leftSection={<IconGoGame size={14} />}>
            밸런스 게임
          </Tabs.Tab>
          <Tabs.Tab
            value={validTabs[1]}
            leftSection={<IconDeviceGamepad size={14} />}
          >
            예측 게임
          </Tabs.Tab>
          <Tabs.Tab
            value={validTabs[2]}
            leftSection={<IconListDetails size={14} />}
          >
            포인트 내역
          </Tabs.Tab>
          <Tabs.Tab
            disabled
            value={validTabs[3]}
            leftSection={<IconListCheck size={14} />}
          >
            예측 내역
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={validTabs[0]}>
          <BalanceRgstrList getStatusBadge={getStatusBadge} />
        </Tabs.Panel>
        <Tabs.Panel value={validTabs[1]}>
          <PredictRgstrList getStatusBadge={getStatusBadge} />
        </Tabs.Panel>

        <Tabs.Panel value={validTabs[2]}>
          <BalancePointAcumList getStatusBadge={getStatusBadge} />
        </Tabs.Panel>
        <Tabs.Panel value={validTabs[3]}>
          <></>
        </Tabs.Panel>
      </Tabs>
    </Content>
  );
};

const GameTypeModal = () => {
  const [balanceOpend, { open: balanceOpen, close: balanceClose }] =
    useDisclosure(false);
  const [predictOpend, { open: predictOpen, close: predictClose }] =
    useDisclosure(false);

  const [opend, { open, close }] = useDisclosure(false);

  const handleSelect = (type: "balance" | "prediction") => {
    close(); // 현재 타입 선택 모달 닫기
    if (type === "balance") balanceOpen();
    else predictOpen();
  };

  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={open} miw={110}>
        게임 생성
      </Button>

      <Modal
        opened={opend}
        onClose={close}
        title="게임 타입 선택"
        centered
        lockScroll={false}
      >
        <Stack>
          <Button onClick={() => handleSelect("balance")}>밸런스 게임</Button>
          <Button onClick={() => handleSelect("prediction")}>예측 게임</Button>
        </Stack>
      </Modal>
      <BalanceCreateModal opened={balanceOpend} close={balanceClose} />
      <PredictCreateModal opened={predictOpend} close={predictClose} />
    </>
  );
};

MyGamesTemplate.ManagementHeader = (
  <Text size="sm" c="dimmed">
    대기 중인 게임만 수정·삭제할 수 있으며, 매일 자정에 시작 상태로 변경됩니다.
  </Text>
);

MyGamesTemplate.ParticipationHeader = (
  <Text size="sm" c="dimmed">
    게임 참여로 획득한 포인트는 최초 1회만 지급되며, 최근 내역이 최상단에
    표시됩니다.
  </Text>
);
MyGamesTemplate.ParticipationPredictHeader = (
  <Text size="sm" c="dimmed">
    최근 참여한 예측 게임 내역이 상단에 표시되며, 예측 성공 시 포인트는
    순차적으로 지급됩니다.
  </Text>
);

export default MyGamesTemplate;
