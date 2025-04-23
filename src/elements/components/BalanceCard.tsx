import { QuestionStatusCd } from "@/constants/ServiceConstants";
import { IQuestionResult } from "@/service/questionApi";
import { useGuestStore, useSettingStore, useUserStore } from "@/store/store";
import { Badge, Box, Button, Card, Flex, Text } from "@mantine/core";
import dayjs from "dayjs";
import React, { useMemo } from "react";

import { useNavigate } from "react-router-dom";

const BalanceCard = React.memo(
  ({ data, isBlur = false }: { data?: IQuestionResult; isBlur?: boolean }) => {
    const navigate = useNavigate();
    const { language } = useSettingStore();
    // const { showAlert } = useAlertStore();
    const { hasVoted } = useGuestStore();

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
      enTitle,
      questionId,
      questionStatusCd,
    } = data || {};

    const dateText = useMemo(() => {
      const [formattedStartDate, formattedEndDate] = [
        strDate ? dayjs(strDate).format("YYYY-MM-DD") : null,
        endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
      ];

      if (!formattedStartDate && !formattedEndDate) {
        return "기간 제한 없음";
      } else if (!formattedStartDate && formattedEndDate) {
        return `종료일: ${formattedEndDate}`;
      } else if (formattedStartDate && !formattedEndDate) {
        return `시작일: ${formattedStartDate}`;
      } else {
        return `${formattedStartDate} ~ ${formattedEndDate}`;
      }
    }, [strDate, endDate]);

    const isGuest = !isLogin;
    const isParticipated = isGuest
      ? hasVoted(questionId ?? "")
      : participation === true;

    return (
      <Card
        shadow="sm"
        padding="lg"
        radius={8}
        mb={20}
        withBorder
        variant="light"
        h={240}
        p="md"
        style={{ flexDirection: "column", justifyContent: "space-between" }}
        className={isBlur ? "no-drag blur" : "no-drag"}
      >
        {/* <Flex direction="column" h="100%" mb={"md"}> */}
        <Text
          mih={100}
          size="xl"
          ta="center"
          fw={900}
          style={{
            wordBreak: "break-word",
          }}
          lineClamp={3}
        >
          {language === "ko" ? title : enTitle ?? title}
        </Text>

        {/* 참여 여부 및 포인트 */}
        <Box mt={"sm"}>
          <Flex justify={"space-between"} align={"center"}>
            <Text size="sm">{dateText}</Text>
            {
              <Badge color={isParticipated ? "cyan" : "yellow"}>
                {isParticipated ? "참여완료" : "미참여"}
              </Badge>
            }{" "}
          </Flex>

          <Button
            mt={"md"}
            fullWidth
            variant={
              questionStatusCd === QuestionStatusCd.END ? "default" : "filled"
            }
            value={questionId}
            color={
              questionStatusCd === QuestionStatusCd.END ? "cyan" : "yellow"
            }
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
