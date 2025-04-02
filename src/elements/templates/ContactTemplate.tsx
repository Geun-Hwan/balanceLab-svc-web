import Content from "@/layout/Content";
import { Button, Paper, Stack, Text, Title } from "@mantine/core";

const ContactTemplate = () => {
  return (
    <Content>
      <Paper
        p="xl"
        shadow="md"
        maw={600}
        mx="auto"
        mih={350}
        withBorder
        radius="md"
        display={"flex"}
        style={{ flexDirection: "column", position: "relative" }}
        mt={"xl"}
      >
        <Stack mb={"sm"}>
          <Title order={3} ta="center">
            비즈니스 및 기타 문의
          </Title>

          <Text ta="center" mt="lg">
            서비스 관련 문의나 제안은 아래 이메일로 연락 바랍니다.
            <br />
            <a href="mailto:help.gugunan@gmail.com">help.gugunan@gmail.com</a>
            <br />
            <br />
            보다 원활한 소통을 위해 구체적인 내용을 함께 제공해 주시면 더 도움이
            됩니다.
            <br />
            <br />
            가입 시 입력한 이메일로 요청을 보내주시면 더 빠른 처리가 가능합니다.
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

export default ContactTemplate;
