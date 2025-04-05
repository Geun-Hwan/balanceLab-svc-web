import { Badge, Button, Card, Flex, Group, Stack, Text } from "@mantine/core";
import dayjs from "dayjs";
import React from "react";
import { useNavigate } from "react-router-dom";

const PredictCard = React.memo(
  ({ data, isBlur = false }: { data?: any; isBlur?: boolean }) => {
    const navigate = useNavigate();

    const calculatePayout = (total: number, bet: number) => {
      const adjustedTotal = total * 0.95; // 전체 금액에서 5% 차감
      return bet > 0 ? (adjustedTotal / bet).toFixed(2) : "-";
    };

    console.log(data);
    const totalPoints = data.pointsA + data.pointsB + data?.pointC || 0;
    const payoutA = calculatePayout(totalPoints, data.pointsA);
    const payoutB = calculatePayout(totalPoints, data.pointsB);
    const payoutC = calculatePayout(totalPoints, data.pointsC);

    return (
      <Card
        className={isBlur ? "no-drag blur" : "no-drag"}
        key={data.id}
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
          h={65}
          mih={65}
          size="xl"
          ta="center"
          style={{
            fontWeight: "900",
            wordBreak: "break-word",
          }}
          lineClamp={2}
        >
          {data.title}
        </Text>

        <Flex
          direction={"column"}
          gap={"sm"}
          my={"sm"}
          justify={"center"}
          flex={1}
        >
          <Flex direction="row" justify="space-between">
            <Text>optin 1</Text>
            <Text fw={"bold"}>{payoutA}</Text>
          </Flex>
          <Flex direction="row" justify="space-between">
            <Text>optin 2</Text>
            <Text fw={"bold"}>{payoutB}</Text>
          </Flex>
          <Flex direction="row" justify="space-between">
            <Text>optin 3</Text>
            <Text fw={"bold"}>{payoutC}</Text>
          </Flex>
        </Flex>

        <Stack mt={"auto"} gap={"xs"}>
          <Group justify="space-between">
            <Group gap={"xs"}>
              <Text size="sm" fw={"bold"}>
                마감시간
              </Text>
              <Text fw={"bolder"}>{dayjs().format("YYYY-MM-DD HH:mm")}</Text>
            </Group>
            <Badge color={data.status === "" ? "cyan" : "gray"} miw={50}>
              {data.status}
            </Badge>
          </Group>
          {
            <Button onClick={() => navigate(`/predict/${data.id}`)}>
              참여하기 ? 참여완료 ? 결과확인
            </Button>
          }
        </Stack>
      </Card>
    );
  }
);

export default PredictCard;
