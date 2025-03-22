import Content from "@/layout/Content";
import { useUserStore } from "@/store/store";
import {
  Flex,
  Group,
  Paper,
  Switch,
  Text,
  Title,
  useMantineColorScheme,
} from "@mantine/core";

const SettingTemplate = () => {
  const { animationEnable, toggleAnimation } = useUserStore();
  const { setThemeColor, themeColor } = useUserStore();
  const { toggleColorScheme } = useMantineColorScheme();

  const handleToggleTheme = () => {
    toggleColorScheme();
    setThemeColor(themeColor === "dark" ? "light" : "dark");
  };
  return (
    <Content>
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
            설정
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
        </Flex>
      </Paper>
    </Content>
  );
};
export default SettingTemplate;
