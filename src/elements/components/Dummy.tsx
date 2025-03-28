import { getQuestionKey, IQuestionResult } from "@/api/questionApi";
import { useUserStore } from "@/store/store";
import { SimpleGrid, Skeleton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import BalanceCard from "./BalanceCard";
import { getPublicQuestion } from "@/api/publicApi";

const Dummy = ({
  repeat = 12,
  cols = 3,
  spacing = 50,
}: {
  repeat?: number;
  cols?: number;
  spacing?: number;
}) => {
  const HANGUL_START = 0xac00; // 가
  const HANGUL_END = 0xd7a3; // 힣

  const { isLogin } = useUserStore();

  const { data, isLoading } = useQuery({
    queryKey: getQuestionKey({ public: true }),
    queryFn: () => getPublicQuestion(),
    enabled: !isLogin,
  });
  const generateRandomHangulWithSpaces = (
    minLength: number,
    maxLength: number
  ) => {
    const length =
      Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    let result = "";
    for (let i = 0; i < length; i++) {
      // 1/5 확률로 띄어쓰기를 추가
      if (Math.random() < 0.2) {
        result += " "; // 띄어쓰기 추가
      } else {
        const randomCode =
          Math.floor(Math.random() * (HANGUL_END - HANGUL_START + 1)) +
          HANGUL_START;
        result += String.fromCharCode(randomCode); // 랜덤 한글 문자 추가
      }
    }
    return result;
  };
  const [dummyData, setDummyData] = useState({ title: "로딩~~~~~~~~~~" });

  useEffect(() => {
    if (!isLoading && data) {
      setDummyData(data);
    }
  }, [isLoading, data]);
  return (
    <SimpleGrid cols={cols} spacing={spacing} w={"100%"}>
      {/* 비로그인 사용자도 볼수있음 */}
      <Skeleton visible={isLoading} key={"public-skeleton"}>
        <BalanceCard data={dummyData as IQuestionResult} />
      </Skeleton>
      {Array.from({ length: repeat }).map((_, index) => {
        const randomTitle = generateRandomHangulWithSpaces(10, 35);
        return (
          <Skeleton visible={isLoading} key={`public-skeleton-${index}`}>
            <BalanceCard
              key={index}
              isBlur
              data={
                {
                  strDate: dayjs(),
                  endDate: dayjs(),
                  title: randomTitle,
                } as IQuestionResult
              }
            />
          </Skeleton>
        );
      })}
    </SimpleGrid>
  );
};

export default React.memo(Dummy);
