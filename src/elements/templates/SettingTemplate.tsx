import Content from "@/layout/Content";
import { useGuestStore, useSettingStore, useUserStore } from "@/store/store";
import {
  Button,
  Flex,
  Group,
  Paper,
  Select,
  Switch,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { Helmet } from "react-helmet-async";

const SettingTemplate = () => {
  const {
    animationEnable,
    toggleAnimation,
    setThemeColor,
    themeColor,
    language,
    setLanguage,
  } = useSettingStore();
  const { resetVotes } = useGuestStore();
  const { isLogin } = useUserStore();
  const { toggleColorScheme } = useMantineColorScheme();

  const handleToggleTheme = () => {
    toggleColorScheme();
    setThemeColor(themeColor === "dark" ? "light" : "dark");
  };
  const handleConfirmReset = () => {
    modals.openConfirmModal({
      title: "참여 내역 초기화",
      children: "게스트 참여 내역을 모두 초기화하시겠습니까?",
      labels: { confirm: "초기화", cancel: "취소" },
      confirmProps: { color: "red", variant: "filled" },
      onConfirm: () => {
        resetVotes();
      },
    });
  };

  return (
    <Content>
      <Helmet>
        <title>홈페이지 설정 | Balance Factory</title>
        <meta
          name="description"
          content="Balance Factory에서 애니메이션, 다크 모드, 언어 설정 등을 조정하여 나만의 맞춤형 환경을 만들어보세요!"
        />
        <meta property="og:title" content="홈페이지 설정 | Balance Factory" />
        <meta
          property="og:description"
          content="애니메이션 효과, 다크 모드, 언어 설정 등 다양한 개인화 옵션을 통해 사이트를 더 편리하게 사용할 수 있습니다."
        />
        <meta property="og:url" content="https://gugunan.ddns.net/setting" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Paper
        p="lg"
        radius="md"
        shadow="md"
        maw={400}
        withBorder
        mih={600}
        w={"100%"}
        display={"flex"}
        mx={"auto"}
        mt={"xl"}
      >
        <Flex direction={"column"} gap={"lg"} flex={1}>
          <Title order={2} ta={"center"} mb={"xl"}>
            홈페이지 설정
          </Title>
          <Group justify="space-between">
            <Text>애니메이션 효과</Text>
            <Switch
              size="md"
              checked={animationEnable}
              onChange={toggleAnimation}
              styles={{ track: { cursor: "pointer" } }}
            />
          </Group>
          <Group justify="space-between" align="center">
            <Text>다크모드</Text>
            <Switch
              styles={{ track: { cursor: "pointer" } }}
              size="md"
              checked={themeColor === "dark"}
              onChange={handleToggleTheme}
            />
          </Group>
          <Group justify="space-between" align="center">
            <Text>언어</Text>
            <Select
              value={language}
              onChange={setLanguage}
              allowDeselect={false}
              data={[
                { value: "ko", label: "한국어" },
                { value: "en", label: "English" },
              ]}
              styles={{
                dropdown: { zIndex: 9999 },
                input: { cursor: "pointer" },
              }}
              w={120}
            />
          </Group>
          {!isLogin && (
            <Button
              variant="outline"
              color="red"
              fullWidth
              mt="auto"
              onClick={handleConfirmReset}
            >
              게스트 참여 내역 초기화
            </Button>
          )}
        </Flex>
      </Paper>
    </Content>
  );
};
export default SettingTemplate;
