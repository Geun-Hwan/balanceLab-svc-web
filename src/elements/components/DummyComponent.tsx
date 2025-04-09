import { IQuestionResult } from "@/service/questionApi";
import {
  dummyType,
  getBalanceDummyData,
  getPredictDummyData,
} from "@/utils/dummy";
import { SimpleGrid, Skeleton } from "@mantine/core";
import React, { useMemo } from "react";
import BalanceCard from "./BalanceCard";
import PredictCard from "./PredictCard";

const DummyComponent = ({
  cols,
  spacing = "xl",
  type = "balance",
  isLoading,
}: {
  cols: number;
  spacing?: number | string;
  type?: dummyType;
  isLoading: boolean;
}) => {
  const publicBalanceData =
    useMemo(() => {
      const dummyList = Array.from({ length: 6 }, () => getBalanceDummyData());

      return dummyList;
    }, [type]) ?? [];

  const publicPredictData =
    useMemo(() => {
      const dummyList = Array.from({ length: 6 }, () => getPredictDummyData());

      return dummyList;
    }, [type]) ?? [];

  return (
    <SimpleGrid cols={cols} spacing={spacing}>
      {/* 비로그인 사용자도 볼수있음 */}
      {type === "balance" &&
        publicBalanceData.map((item: IQuestionResult, index) => (
          <Skeleton visible={isLoading} key={`b_dummy_item-${index}`}>
            <BalanceCard data={item} isBlur />
          </Skeleton>
        ))}

      {type === "predict" &&
        publicPredictData.map((item: any, index) => (
          <Skeleton visible={isLoading} key={`p_dummy_item-${index}`}>
            <PredictCard data={item} isBlur />
          </Skeleton>
        ))}
    </SimpleGrid>
  );
};

export default React.memo(DummyComponent);
