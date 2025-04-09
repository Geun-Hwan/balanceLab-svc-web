import {
  CATEGORIES,
  CategoryValue,
  QuestionStatusCd,
} from "@/constants/ServiceConstants";
import Content from "@/layout/Content";
import { useUserStore } from "@/store/store";
import BalancePointAcumList from "@cmp/BalancePointAcumList";
import PredictCreateModal from "@cmp/PredictCreateModal";
import PredictRgstrList from "@cmp/PredictRgstrList";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Group,
  Modal,
  Stack,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDeviceGamepad,
  IconEdit,
  IconEye,
  IconGoGame,
  IconListCheck,
  IconListDetails,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BalanceCreateModal from "../components/BalanceCreateModal";
import BalanceRgstrList from "../components/BalanceRgstrList";
import PredictParticipationList from "@cmp/PredictParticipationList";

const validTabs = {
  myRgstrBalance: "#my-rgstr-balance",
  myBalanceHistory: "#my-balance-hisotry",
  myRgstrPredict: "#my-rgstr-predict",
  myPredictHistory: "#my-predict-history",
} as const;

type TabHash = (typeof validTabs)[keyof typeof validTabs];

const MyGamesTemplate = () => {
  const location = useLocation();
  const getValidHash = () => (location.hash || "#my-rgstr-balance") as TabHash;
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabHash>(getValidHash());

  useEffect(() => {
    setActiveTab(getValidHash()); // location.hash 변경 감지 후 상태 업데이트
  }, [location.hash]);

  const handleTapChange = (value: string | null) => {
    setActiveTab(value as (typeof validTabs)[keyof typeof validTabs]);

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
        {(activeTab === validTabs.myRgstrBalance ||
          activeTab === validTabs.myRgstrPredict) &&
          MyGamesTemplate.ManagementHeader}

        {activeTab === validTabs.myBalanceHistory &&
          MyGamesTemplate.BalanceHistoryHeader}
        {activeTab === validTabs.myPredictHistory &&
          MyGamesTemplate.PredictHistoryHeader}

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
          <Tabs.Tab
            value={validTabs.myRgstrBalance}
            leftSection={<IconGoGame size={14} />}
          >
            밸런스 게임
          </Tabs.Tab>
          <Tabs.Tab
            value={validTabs.myBalanceHistory}
            leftSection={<IconListDetails size={14} />}
          >
            참여 내역
          </Tabs.Tab>
          <Tabs.Tab
            value={validTabs.myRgstrPredict}
            leftSection={<IconDeviceGamepad size={14} />}
          >
            예측 게임
          </Tabs.Tab>

          <Tabs.Tab
            value={validTabs.myPredictHistory}
            leftSection={<IconListCheck size={14} />}
          >
            예측 내역
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={validTabs.myRgstrBalance}>
          <BalanceRgstrList />
        </Tabs.Panel>

        <Tabs.Panel value={validTabs.myBalanceHistory}>
          <BalancePointAcumList />
        </Tabs.Panel>
        <Tabs.Panel value={validTabs.myRgstrPredict}>
          <PredictRgstrList />
        </Tabs.Panel>

        <Tabs.Panel value={validTabs.myPredictHistory}>
          <PredictParticipationList />
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

type CardHeaderSectionProps = {
  statusCd: QuestionStatusCd;
  delYn?: boolean; // optional
  categoryCd?: string; // optional
  children?: ReactNode;
};

MyGamesTemplate.CardHeaderSection = ({
  statusCd,
  delYn = false,

  children,
}: CardHeaderSectionProps) => {
  const statusMap: Record<QuestionStatusCd, React.ReactNode> = {
    [QuestionStatusCd.PROGRESS]: <Badge color="green">진행중</Badge>,
    [QuestionStatusCd.END]: <Badge color="blue">마감됨</Badge>,
    [QuestionStatusCd.WAITING]: <Badge color="yellow">대기중</Badge>,
    [QuestionStatusCd.COMPLETE]: <Badge color="yellow">지급완료</Badge>,
  };

  return (
    <Card.Section p="md" withBorder>
      <Group justify="space-between">
        <Group>
          {delYn && <Badge color="red">삭제됨</Badge>}
          {statusMap[statusCd]}
        </Group>
        {children}
      </Group>
    </Card.Section>
  );
};

type CardFooterProps<T> = {
  id: string;
  data: T;
  onView?: (data: T) => void;
  onEdit?: (data: T) => void;
  onDelete?: (data: T) => void;
  leftSlot?: React.ReactNode; // 좌측에 렌더링할 요소 (ex: 날짜)
};

MyGamesTemplate.CardFooter = <T,>({
  id,
  data,
  onView,
  onEdit,
  onDelete,
  leftSlot,
}: CardFooterProps<T>) => {
  const buttons: JSX.Element[] = [];

  if (onView) {
    buttons.push(
      <ActionIcon
        variant="light"
        onClick={() => onView(data)}
        key={`view-${id}`}
      >
        <IconEye size={16} />
      </ActionIcon>
    );
  }

  if (onEdit) {
    buttons.push(
      <ActionIcon
        variant="light"
        color="blue"
        onClick={() => onEdit(data)}
        key={`edit-${id}`}
      >
        <IconEdit size={16} />
      </ActionIcon>
    );
  }

  if (onDelete) {
    buttons.push(
      <ActionIcon
        variant="light"
        color="red"
        onClick={() => onDelete(data)}
        key={`delete-${id}`}
      >
        <IconTrash size={16} />
      </ActionIcon>
    );
  }

  return (
    <Flex
      justify={leftSlot ? "space-between" : "flex-end"}
      align="flex-end"
      mt={"lg"}
    >
      {leftSlot}
      <Group>{buttons}</Group>
    </Flex>
  );
};

MyGamesTemplate.ManagementHeader = (
  <Text size="sm" c="dimmed">
    대기 중인 게임만 수정·삭제할 수 있으며, 매일 자정에 시작 상태로 변경됩니다.
  </Text>
);

MyGamesTemplate.BalanceHistoryHeader = (
  <Text size="sm" c="dimmed">
    밸런스게임 참여로 획득한 포인트는 최초 1회만 지급되며, 최근 내역이 상단에
    표시됩니다.
  </Text>
);
MyGamesTemplate.PredictHistoryHeader = (
  <Text size="sm" c="dimmed">
    최근 참여한 예측 게임 내역이 상단에 표시되며, 예측 성공 시 포인트는
    순차적으로 지급됩니다.
  </Text>
);

MyGamesTemplate.Nodata = ({ text }: { text: string }) => {
  return (
    <Box p="md">
      <Title ta="center" fw={500} mt="xl" c="dimmed" order={3}>
        {text}
      </Title>
    </Box>
  );
};

export default MyGamesTemplate;
