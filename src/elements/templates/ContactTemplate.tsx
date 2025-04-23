import Content from "@/layout/Content";
import { Button, Paper, Stack, Text, Title } from "@mantine/core";
import { Helmet } from "react-helmet-async";

const ContactTemplate = () => {
  return (
    <Content>
      <Helmet>
        <title>문의하기 | Balance Factory</title>
        <meta
          name="description"
          content="Balance Factory에 대한 문의 사항을 남겨주세요. 빠른 시간 내에 답변드리겠습니다."
        />
        <meta property="og:title" content="문의하기 | Balance Factory" />
        <meta
          property="og:description"
          content="사이트에 대해 궁금한 점이 있으시면 언제든지 문의해주세요. 빠르게 답변 드리겠습니다."
        />
        <meta property="og:url" content="https://gugunan.ddns.net/contact" />
        <meta property="og:type" content="website" />
      </Helmet>

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
