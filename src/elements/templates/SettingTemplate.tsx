import { useUserStore } from "@/store/store";
import {
  Box,
  Flex,
  Group,
  Paper,
  Switch,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";

export const SettingTemplate = () => {
  const { isLogin, animationEnable, toggleAnimation } = useUserStore();
  const { setThemeColor, themeColor } = useUserStore();
  const { toggleColorScheme } = useMantineColorScheme();

  const handleToggleTheme = () => {
    toggleColorScheme();
    setThemeColor(themeColor === "dark" ? "light" : "dark");
  };
  return (
    <Flex justify={"center"} h={"90dvh"} p={"sm"}>
      <Paper
        p="lg"
        radius="md"
        shadow="md"
        flex={1}
        maw={"400"}
        withBorder
        display={"flex"}
        h={"100%"}
        style={{ flexDirection: "column" }}
      >
        <Title order={2} ta={"center"} mb={"xl"}>
          설정색
        </Title>
        <Flex direction={"column"} flex={1} gap={"lg"}>
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
            <Text>마케팅 알림 수신</Text>
            <Switch
              size="md"
              checked={false}
              styles={{ track: { cursor: "pointer" } }}
            />
          </Group>
        </Flex>
        <Box>
          <Group justify="space-between" align="center">
            <Text>다크모드</Text>
            <Switch
              styles={{ track: { cursor: "pointer" } }}
              size="md"
              checked={themeColor === "dark"}
              onChange={handleToggleTheme}
            />
          </Group>
        </Box>
      </Paper>
    </Flex>
  );
};
export default SettingTemplate;
