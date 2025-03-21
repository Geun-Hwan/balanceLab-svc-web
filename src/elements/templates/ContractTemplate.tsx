import Content from "@/layout/Content";
import { Button, Flex, Paper, Stack, Text, Title } from "@mantine/core";

const ContractTemplate = () => {
  return (
    <Content>
      <Paper
        p="xl"
        shadow="md"
        maw={600}
        m="auto"
        mih={350}
        withBorder
        radius="md"
        display={"flex"}
        style={{ flexDirection: "column", top: -50, position: "relative" }}
      >
        <Stack>
          <Title order={3} ta="center">
            비즈니스 협업 및 기타 문의
          </Title>

          <Text ta="center" mt="lg">
            서비스 관련 질문이나 제휴 제안은 언제든지 이메일로 보내주시면
            신속하게 답변드리겠습니다. 보다 원활한 소통을 위해 구체적인 내용을
            함께 제공해 주시면 더 도움이 됩니다.
          </Text>
        </Stack>
        <Stack align="center" justify="flex-end" flex={1}>
          <Button
            component="a"
            href="mailto:help.gugunan@gmail.com"
            variant="light"
            c={"blue"}
            size="lg"
            fullWidth
            maw={200}
          >
            이메일 보내기
          </Button>
        </Stack>
      </Paper>
    </Content>
  );
};

export default ContractTemplate;
