import { getPublicQuestionList } from "@/service/publicApi";
import { getQuestionKey, IQuestionResult } from "@/service/questionApi";
import { useUserStore } from "@/store/store";
import {
  dummyType,
  getBalanceDummyData,
  getPredictDummyData,
} from "@cmp/dummy";
import { SimpleGrid, Skeleton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import BalanceCard from "./BalanceCard";
import PredictCard from "./PredictCard";

const DummyComponent = ({
  repeat = 9,
  cols = 3,
  spacing = 50,
  type = "balance",
}: {
  repeat?: number;
  cols?: number;
  spacing?: number;
  type?: dummyType;
}) => {
  const { isLogin } = useUserStore();

  const { data: publicData, isLoading: publicLoading } = useQuery({
    queryKey: getQuestionKey({ public: true }),
    queryFn: () => getPublicQuestionList(),
    enabled: !isLogin && type === "balance",
  });

  const publicBalanceData =
    useMemo(() => {
      if (!publicLoading) {
        const data = publicData ?? [];
        const dummyList = Array.from(
          { length: repeat + (data.length % 3) },
          () => getBalanceDummyData()
        );

        return data.concat(dummyList);
      }
    }, [publicLoading, publicData]) ?? [];

  const publicPredictData =
    useMemo(() => {
      const dummyList = Array.from({ length: repeat + 3 }, () =>
        getPredictDummyData()
      );

      return dummyList;
    }, []) ?? [];

  return (
    <SimpleGrid cols={cols} spacing={spacing} w={"100%"}>
      {/* 비로그인 사용자도 볼수있음 */}
      {type === "balance" &&
        publicBalanceData.map((item: IQuestionResult, index) => (
          <Skeleton visible={publicLoading} key={`b_dummy_item-${index}`}>
            <BalanceCard data={item} isBlur={item.isPublic !== true} />
          </Skeleton>
        ))}

      {type === "predict" &&
        publicPredictData.map((item: any, index) => (
          <Skeleton visible={publicLoading} key={`p_dummy_item-${index}`}>
            <PredictCard data={item} isBlur={item.isPublic !== true} />
          </Skeleton>
        ))}
    </SimpleGrid>
  );
};

export default React.memo(DummyComponent);
