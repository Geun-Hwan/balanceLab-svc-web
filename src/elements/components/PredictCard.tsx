import { QuestionStatusCd } from "@/constants/ServiceConstants";
import { IPredictResult } from "@/service/predictApi";
import { useAlertStore, useUserStore } from "@/store/store";
import { Badge, Button, Card, Flex, Group, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import React from "react";
import { useNavigate } from "react-router-dom";

const PredictCard = React.memo(
  ({ data, isBlur = false }: { data?: IPredictResult; isBlur?: boolean }) => {
    const navigate = useNavigate();
    const { isLogin } = useUserStore();
    const { showAlert } = useAlertStore();
    const {
      predictId,
      title,
      optionA,
      optionB,
      optionC,
      payoutA = "2.0",
      payoutB = "2.0",
      payoutC = "2.0",
      endDtm,
      questionStatusCd,
      participation,
    } = data || {};

    const handleClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      const { value } = e.currentTarget;

      if (!isLogin) {
        showAlert("로그인 후에 이용 가능합니다.");
        return;
      }

      if (value) {
        navigate(`/predict/${predictId}`);
      }
    };

    return (
      <Card
        className={isBlur ? "no-drag blur" : "no-drag"}
        key={predictId}
        shadow="sm"
        padding="lg"
        radius={8}
        withBorder
        variant="light"
        p="md"
        h={300}
        mah={300}
        display={"flex"}
        style={{ flexDirection: "column" }}
      >
        <Text
          mih={70}
          size="xl"
          ta="center"
          style={{
            fontWeight: "900",
            wordBreak: "break-word",
          }}
          lineClamp={2}
        >
          {title}
        </Text>

        <Flex
          direction={"column"}
          gap={"sm"}
          my={"sm"}
          justify={"center"}
          flex={1}
        >
          <Flex direction="row" justify="space-between">
            <Text>{optionA}</Text>
            <Text fw={"bold"}>{payoutA}</Text>
          </Flex>
          <Flex direction="row" justify="space-between">
            <Text>{optionB}</Text>
            <Text fw={"bold"}>{payoutB}</Text>
          </Flex>
          {optionC && (
            <Flex direction="row" justify="space-between">
              <Text>{optionC}</Text>
              <Text fw={"bold"}>{payoutC}</Text>
            </Flex>
          )}
        </Flex>

        <Stack mt={"auto"} gap={"xs"}>
          <Group justify="space-between">
            <Group gap={"xs"}>
              <Text size="sm" fw={"bold"}>
                마감시간
              </Text>
              <Text fw={"bolder"}>
                {dayjs(endDtm).format("YYYY-MM-DD HH:mm")}
              </Text>
            </Group>
            <Badge
              miw={60}
              color={
                questionStatusCd === QuestionStatusCd.PROGRESS
                  ? "blue" // 진행중: 눈에 띄게
                  : questionStatusCd === QuestionStatusCd.END
                  ? "yellow"
                  : "gray" //
              }
            >
              {questionStatusCd === QuestionStatusCd.PROGRESS
                ? "진행중"
                : questionStatusCd === QuestionStatusCd.END
                ? "결산중"
                : "결산완료"}
            </Badge>
          </Group>
          {
            <Button
              onClick={handleClick}
              value={predictId}
              variant={
                questionStatusCd === QuestionStatusCd.PROGRESS
                  ? "filled"
                  : "default"
              }
              color={participation ? "cyan" : "yellow"}
            >
              {questionStatusCd === QuestionStatusCd.PROGRESS
                ? participation
                  ? "참여완료"
                  : "참여하기"
                : "결과보기"}
            </Button>
          }
        </Stack>
      </Card>
    );
  }
);

export default PredictCard;
