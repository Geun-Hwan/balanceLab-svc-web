import { QuestionStatusCd } from "@/constants/ServiceConstants";
import { IQuestionResult } from "@/service/questionApi";
import { useUserStore } from "@/store/store";
import { Badge, Box, Button, Card, Flex, Text } from "@mantine/core";
import dayjs from "dayjs";
import React from "react";

import { useNavigate } from "react-router-dom";

const BalanceCard = React.memo(
  ({ data, isBlur = false }: { data?: IQuestionResult; isBlur?: boolean }) => {
    const navigate = useNavigate();
    // const { showAlert } = useAlertStore();

    const { isLogin } = useUserStore();
    const handleClick = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      const { value } = e.currentTarget;
      if (value) {
        navigate(`/balance/${value}`);
      }
    };

    const {
      point,
      participation,
      strDate,
      endDate,
      title,
      questionId,
      questionStatusCd,
    } = data || {};
    const [formattedStartDate, formattedEndDate] = [
      strDate ? dayjs(strDate).format("YYYY-MM-DD") : null,
      endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
    ];

    return (
      <Card
        shadow="sm"
        padding="lg"
        radius={8}
        mb={20}
        withBorder
        variant="light"
        h={220}
        mah={220}
        p="md"
        style={{ flexDirection: "column", justifyContent: "space-between" }}
        className={isBlur ? "no-drag blur" : "no-drag"}
      >
        {/* <Flex direction="column" h="100%" mb={"md"}> */}
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
          {title}
        </Text>

        {/* 참여 여부 및 포인트 */}
        <Box>
          <Flex justify={"space-between"} align={"center"}>
            <Text size="sm">
              {!formattedStartDate && !formattedEndDate
                ? "기간 제한없음"
                : `${formattedStartDate} ~ ${formattedEndDate}`}
            </Text>
            {isLogin && (
              <Badge color={participation ? "cyan" : "yellow"}>
                {participation ? "획득완료" : "미참여"}
              </Badge>
            )}{" "}
          </Flex>

          <Button
            mt={"md"}
            fullWidth
            variant={
              questionStatusCd === QuestionStatusCd.END ? "default" : "filled"
            }
            value={questionId}
            color={participation ? "cyan" : "yellow"}
            onClick={handleClick}
          >
            {questionStatusCd === QuestionStatusCd.END
              ? "마감 결과확인"
              : `${
                  isLogin && !participation ? point + "p 획득 가능" : "진행중"
                }`}
          </Button>
        </Box>
      </Card>
    );
  }
);

export default BalanceCard;
