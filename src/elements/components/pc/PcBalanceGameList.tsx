// PCBalanceGameList.jsx - PC용 밸런스 게임 리스트 컴포넌트
import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Group,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";

import { useState } from "react";
import BalanceCard from "../BalanceCard";
import { useQuery } from "@tanstack/react-query";
import { getQuestionKey, getQuestionList } from "@/libs/api/questionApi";
import { getAccessToken } from "@/libs/utils/cookieUtil";
import { useUserStore } from "@/libs/store/store";
import { DummyData } from "@/elements/templates/MainHomeTemplate";

const dummyData = [
  {
    questionId: 1,
    title: "당신의 좋아하는 색은 무엇인가요?",
  },
  {
    questionId: 2,
    title: "어떤 운동을 좋아하시나요?",
  },
  {
    questionId: 3,
    title: "가장 좋아하는 영화 장르는 무엇인가요?",
  },
  // 더 많은 더미 데이터 추가
];

const PCBalanceGameList = () => {
  const { isLogin } = useUserStore();

  const { data } = useQuery({
    queryKey: getQuestionKey(),
    queryFn: () => getQuestionList(),
    enabled: !!getAccessToken(),
  });

  const categories = [
    { value: "social", label: "사회" },
    { value: "politics", label: "정치" },
    { value: "lifestyle", label: "라이프스타일" },
    { value: "entertainment", label: "연예" },
    { value: "sports", label: "스포츠" },
  ];

  const [filters, setFilters] = useState({
    search: "",
    categories: [],
    startDate: null,
    endDate: null,
    showEnded: false,
  });

  // 필터 변경 핸들러
  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 카테고리 체크박스 핸들러
  const handleCategoryChange = (category: string, checked: boolean) => {};

  // 필터 적용 함수
  const applyFilters = () => {
    // 필터 적용 로직
    console.log("Applying filters:", filters);
  };

  // 카테고리 목록 (실제 데이터로 대체 필요)

  return (
    <Container size="xl" py="md" maw="90%">
      {/* 필터 섹션 */}
      <Box mb="xl" p="md" style={{ borderBottom: "1px solid #eee" }}>
        <Flex wrap="wrap" align={"center"}>
          {/* 검색 */}
          <TextInput
            placeholder="검색어를 입력하세요"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            style={{ minWidth: "200px", marginBottom: "16px" }} // 여백 추가
          />

          {/* 기간 선택 */}
          <Group>{/* 기간 선택 컴포넌트 구현 */}</Group>

          {/* 종료 여부 */}
          <Checkbox
            label="종료된 게임 포함"
            checked={filters.showEnded}
            onChange={(e) =>
              handleFilterChange("showEnded", e.currentTarget.checked)
            }
            style={{ marginBottom: "16px" }} // 여백 추가
          />

          {/* 필터 적용 버튼 */}
          <Button onClick={applyFilters} style={{ marginBottom: "16px" }}>
            검색
          </Button>
        </Flex>

        {/* 카테고리 체크박스 */}
        <Box mt="md">
          <Text size="sm" w={500} mb="xs">
            카테고리
          </Text>
          <Flex wrap="wrap">
            {categories.map((category) => (
              <Checkbox
                key={category.value}
                label={category.label}
                // checked={filters.categories.includes(category.value)}
                onChange={(e) =>
                  handleCategoryChange(category.value, e.currentTarget.checked)
                }
                style={{ marginBottom: "8px", marginRight: "16px" }} // 여백 추가
              />
            ))}
          </Flex>
        </Box>
      </Box>

      {/* PC용 그리드 레이아웃 (3개씩) */}
      <SimpleGrid cols={3} spacing={50}>
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

export default PCBalanceGameList;
