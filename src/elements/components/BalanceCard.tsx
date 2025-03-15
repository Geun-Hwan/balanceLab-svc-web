import { IQuestionResult } from "@/libs/api/questionApi";
import {
  Card,
  Group,
  Title,
  Text,
  Badge,
  Button,
  Flex,
  Box,
} from "@mantine/core";
import dayjs from "dayjs";
import React from "react";
import { useNavigate } from "react-router-dom";

const BalanceCard = ({
  data,
  isBlur = false,
}: {
  data?: IQuestionResult;
  isBlur?: boolean;
}) => {
  const navigate = useNavigate();
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const { value } = e.currentTarget;
    if (value) {
      navigate(`/question/${value}`);
    }
  };

  const { point, participation, strDate, endDate, title, questionId } =
    data || {};
  const [formattedStartDate, formattedEndDate] = [
    dayjs(strDate).format("YYYY-MM-DD"),
    dayjs(endDate).format("YYYY-MM-DD"),
  ];

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius={8}
      mb={20}
      withBorder
      variant="light"
      h={200}
      mah={200}
      p="md"
      className={isBlur ? "no-drag blur" : "no-drag"}
    >
      <Flex direction="column" h="100%">
        <Box mb="md" style={{ overflow: "hidden", flex: "1 1 auto" }}>
          <Title
            size="lg"
            ta={"center"}
            lineClamp={3}
            style={{
              wordWrap: "break-word",
            }}
          >
            {isBlur ? "로그인후 이용하세요." : title}
          </Title>
        </Box>

        {/* 참여 여부 및 포인트 */}
        <Box style={{ flex: "0 0 auto" }}>
          <Flex justify={"space-between"} align={"center"} mb={"md"}>
            <Text size="sm">
              {formattedStartDate} ~ {formattedEndDate}
            </Text>

            <Badge color={participation ? "cyan" : "yellow"}>
              {participation ? "참여 완료" : "미참여"}
            </Badge>
          </Flex>

          <Button
            fullWidth
            variant="outline"
            value={questionId}
            color={participation ? "cyan" : "yellow"}
            onClick={handleClick}
          >
            {participation
              ? "결과보기"
              : point
              ? `${point}p 획득 가능`
              : "참여하기"}
          </Button>
        </Box>
      </Flex>
    </Card>
  );
};

export default BalanceCard;
