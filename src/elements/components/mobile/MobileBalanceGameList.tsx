// MobileBalanceGameList.jsx - 모바일용 밸런스 게임 리스트 컴포넌트

import { getQuestionKey, getQuestionList } from "@/libs/api/questionApi";
import { useUserStore } from "@/libs/store/store";
import { getAccessToken } from "@/libs/utils/cookieUtil";
import { Container, SimpleGrid } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import BalanceCard from "../BalanceCard";
import { DummyData } from "@/elements/templates/MainHomeTemplate";

const MobileBalanceGameList = () => {
  const { isLogin } = useUserStore();

  const { data } = useQuery({
    queryKey: getQuestionKey(),
    queryFn: () => getQuestionList(),
    enabled: !!getAccessToken(),
  });

  return (
    <Container size="xl" py="md" maw="100%">
      <SimpleGrid cols={1} spacing={50}>
        {isLogin ? (
          data?.map(
            (item: {
              questionId: any;
              point?: number;
              title?: string;
              choiceA?: string;
              choiceB?: string;
              choiceType?: "A" | "B" | null;
            }) => <BalanceCard key={item.questionId} data={item} />
          )
        ) : (
          <DummyData />
        )}
      </SimpleGrid>
    </Container>
  );
};

export default MobileBalanceGameList;
