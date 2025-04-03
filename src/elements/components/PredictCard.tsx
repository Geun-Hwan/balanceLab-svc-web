import { QuestionStatusCd } from "@/constants/ServiceConstants";
import { Badge, Box, Button, Card, Flex, Progress, Text } from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router-dom";

const PredictCard = React.memo(
  ({ data, isBlur = false }: { data?: any; isBlur?: boolean }) => {
    const FEE_RATE = 0.1;
    const navigate = useNavigate();

    const calculatePayout = (total: number, bet: number) => {
      return bet > 0 ? ((total * (1 - FEE_RATE)) / bet).toFixed(2) : "-";
    };

    const totalPoints = data.pointsA + data.pointsB;
    const payoutA = calculatePayout(totalPoints, data.pointsA);
    const payoutB = calculatePayout(totalPoints, data.pointsB);

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
        h={220}
        mah={220}
      >
        <Text
          h={100}
          mih={100}
          size="xl"
          ta="center"
          style={{
            fontWeight: "900",
            wordBreak: "break-word",
          }}
          lineClamp={3}
        >
          {data.title}
        </Text>

        <Box>
          <Badge color={data.status === "진행 중" ? "cyan" : "gray"}>
            {data.status}
          </Badge>
          {data.status === "진행 중" && (
            <Button onClick={() => navigate(`/predict/${data.id}`)}>
              참여하기
            </Button>
          )}
        </Box>
      </Card>
    );
  }
);

export default PredictCard;
