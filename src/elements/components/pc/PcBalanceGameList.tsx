import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Group,
  Loader,
  SimpleGrid,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

import { DummyData } from "@/elements/templates/MainHomeTemplate";
import { useBalanceGameList } from "@/hooks/useBalanceGameList";
import { IQuestionResult } from "@/libs/api/questionApi";
import { useUserStore } from "@/libs/store/store";
import { CATEGORIES } from "@/libs/utils/serviceConstants";
import { DatePickerInput } from "@mantine/dates";
import BalanceCard from "../BalanceCard";
import { useRef, useEffect } from "react";

const PCBalanceGameList = () => {
  const { isLogin } = useUserStore();
  const {
    filters,
    data,
    handleFilterChange,
    handleDateChange,
    handleCategoryChange,
    applySearch,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading,
  } = useBalanceGameList(isLogin, 30);

  // 필터 변경 핸들러

  // 카테고리 목록 (실제 데이터로 대체 필요)

  const observerRef = useRef<HTMLDivElement | null>(null);

  // ✅ IntersectionObserver를 사용한 자동 로딩
  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );
    observer.observe(observerRef.current);

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasNextPage, isFetchingNextPage]);

  return (
    <Container size="xl" py="md" maw="90%">
      {/* 필터 섹션 */}
      <Box mb="xl" p="md" style={{ borderBottom: "1px solid #eee" }}>
        <Flex wrap="wrap" align={"center"} mb={30}>
          {/* 검색 */}
          <TextInput
            name="search"
            placeholder="검색어를 입력하세요"
            value={filters.search}
            onChange={handleFilterChange}
            miw={300}
            w={"33%"}
          />
          <Button onClick={applySearch} miw={150} ml={30}>
            검색
          </Button>
        </Flex>
        {/* 종료 여부 */}
        <Title size="sm" w={500} mb={10}>
          마감일
        </Title>
        <Group mb={30}>
          <DatePickerInput
            clearable
            maxLevel="month"
            dropdownType="modal"
            name="startDate"
            valueFormat="YYYY-MM-DD"
            placeholder="날짜를 선택하세요."
            value={filters.startDate}
            onChange={(v: any) => handleDateChange(v, "startDate")}
            locale="ko"
          />
          <Text>~</Text>
          <DatePickerInput
            name="endDate"
            maxLevel="month"
            clearable
            dropdownType="modal"
            valueFormat="YYYY-MM-DD"
            placeholder="날짜를 선택하세요."
            value={filters.endDate}
            onChange={(v: any) => handleDateChange(v, "endDate")}
            locale="ko"
          />
          <Checkbox
            ml={20}
            name="showEnded"
            label="마감된 게임 포함"
            checked={filters.showEnded}
            onChange={handleFilterChange}
          />
        </Group>

        {/* 카테고리 체크박스 */}
        <Title size="sm" w={500} mb={10}>
          카테고리
        </Title>
        <Flex wrap="wrap" align={"center"}>
          {CATEGORIES.map((category) => (
            <Checkbox
              value={category.value}
              key={category.value}
              label={category.label}
              checked={filters.categories.includes(category.value)}
              onChange={handleCategoryChange}
              mr={15}
            />
          ))}
        </Flex>
      </Box>

      {/* PC용 그리드 레이아웃 (3개씩) */}

      {isLogin ? (
        <SimpleGrid cols={3} spacing={50}>
          {isLogin}
          {data?.pages?.map((page) =>
            page.content.map((item) => (
              <BalanceCard key={item.questionId} data={item} />
            ))
          )}

          <div
            ref={observerRef}
            style={{ height: 10, background: "transparent" }}
          />
          {(isFetchingNextPage || isLoading) && (
            <Flex justify={"center"}>
              <Loader size={"xl"} />
            </Flex>
          )}
        </SimpleGrid>
      ) : (
        <DummyData />
      )}
    </Container>
  );
};

export default PCBalanceGameList;
