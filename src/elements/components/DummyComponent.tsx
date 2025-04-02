import { getPublicQuestionList } from "@/service/publicApi";
import { getQuestionKey, IQuestionResult } from "@/service/questionApi";
import { useUserStore } from "@/store/store";
import { SimpleGrid, Skeleton } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getDummyData } from "@cmp/dummy";
import BalanceCard from "./BalanceCard";

const DummyComponent = ({
  repeat = 9,
  cols = 3,
  spacing = 50,
}: {
  repeat?: number;
  cols?: number;
  spacing?: number;
}) => {
  const { isLogin } = useUserStore();

  const { data, isLoading } = useQuery({
    queryKey: getQuestionKey({ public: true }),
    queryFn: () => getPublicQuestionList(),
    enabled: !isLogin,
  });

  const [publicData, setPublicData] = useState<IQuestionResult[]>([]);

  useEffect(() => {
    if (!isLoading && data) {
      setPublicData(data);
    }
  }, [isLoading, data]);

  const dummyList = Array.from(
    { length: repeat + (publicData.length % 3) },
    () => getDummyData()
  );
  return (
    <SimpleGrid cols={cols} spacing={spacing} w={"100%"}>
      {/* 비로그인 사용자도 볼수있음 */}
      {[...publicData, ...dummyList].map((item: IQuestionResult, index) => (
        <Skeleton visible={isLoading} key={`item-${index}`}>
          <BalanceCard data={item} isBlur={item.isPublic !== true} />
        </Skeleton>
      ))}
    </SimpleGrid>
  );
};

export default React.memo(DummyComponent);
