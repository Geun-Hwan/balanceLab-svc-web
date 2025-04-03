import { Badge, Button, Card, Progress } from "@mantine/core";
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
      >
        <h2 className="text-lg font-semibold text-center break-words line-clamp-2">
          {data.title}
        </h2>
        <div className="text-sm flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span>{data.choiceA}</span>
            <Progress value={data.percentageA} className="w-2/3" />
            <span>
              {data.percentageA}% ({payoutA}배)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>{data.choiceB}</span>
            <Progress value={data.percentageB} className="w-2/3" />
            <span>
              {data.percentageB}% ({payoutB}배)
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <Badge color={data.status === "진행 중" ? "cyan" : "gray"}>
            {data.status}
          </Badge>
          {data.status === "진행 중" && (
            <Button onClick={() => navigate(`/predict/${data.id}`)}>
              참여하기
            </Button>
          )}
        </div>
      </Card>
    );
  }
);

export default PredictCard;
