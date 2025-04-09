import { QuestionStatusCd } from "@/constants/ServiceConstants";
import { IPredictResult } from "@/service/predictApi";
import { calculatePercentage } from "@/utils/predict";
import { Badge, Button, Card, Flex, Group, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import React from "react";

const PredictCard = React.memo(
  ({
    data,
    isBlur = false,

    handleClick,
  }: {
    data: IPredictResult;
    isBlur?: boolean;
    handleClick?: (data: IPredictResult) => void;
  }) => {
    const {
      predictId,
      title,
      optionA,
      optionB,
      optionC,
      countA = 0,
      countB = 0,
      countC = 0,
      endDtm,
      questionStatusCd,
      participation,
    } = data || {};

    return (
      <>
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
              <Text fw={"bold"}>
                {!isBlur ? `${calculatePercentage(data, countB)}%` : "N/A"}
              </Text>
            </Flex>
            <Flex direction="row" justify="space-between">
              <Text>{optionB}</Text>
              <Text fw={"bold"}>
                {!isBlur ? `${calculatePercentage(data, countB)}%` : "N/A"}
              </Text>
            </Flex>
            {optionC && (
              <Flex direction="row" justify="space-between">
                <Text>{optionC}</Text>
                <Text fw={"bold"}>
                  {!isBlur ? `${calculatePercentage(data, countC)}%` : "N/A"}
                </Text>
              </Flex>
            )}
          </Flex>

          <Stack mt={"auto"} gap={"xs"}>
            <Group justify="space-between">
              <Text fw={"bolder"}>
                마감: {dayjs(endDtm).format("YYYY-MM-DD HH:mm")}
              </Text>
              <Badge
                miw={60}
                color={
                  questionStatusCd === QuestionStatusCd.PROGRESS
                    ? "yellow" // 진행중: 눈에 띄게
                    : questionStatusCd === QuestionStatusCd.END
                    ? "blue"
                    : "gray" //
                }
              >
                {questionStatusCd === QuestionStatusCd.PROGRESS
                  ? "진행중"
                  : questionStatusCd === QuestionStatusCd.END
                  ? "지급대기"
                  : "지급완료"}
              </Badge>
            </Group>
            {
              <Button
                onClick={() => handleClick && handleClick(data)}
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
      </>
    );
  }
);

export default PredictCard;
