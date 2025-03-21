import {
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
  Loader,
  ScrollArea,
  SimpleGrid,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

import { CATEGORIES } from "@/constants/serviceConstants";
import { useBalanceGameList } from "@/hooks/useBalanceGameList";
import { useUserStore } from "@/store/store";
import Dummy from "@cmp/Dummy";
import { DatePickerInput } from "@mantine/dates";
import { modals } from "@mantine/modals";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BalanceCard from "../BalanceCard";

const PCBalanceGameList = () => {
  const { isLogin } = useUserStore();
  const navigate = useNavigate();

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
    isFetching,
  } = useBalanceGameList(30);

  const observerRef = useRef<HTMLDivElement | null>(null);

  // ✅ IntersectionObserver를 사용한 자동 로딩
  useEffect(() => {
    if (!observerRef.current) return;
    if (isFetchingNextPage) return;
    const currentRef = observerRef.current; // ref 값을 변수에 저장
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [isFetchingNextPage, hasNextPage]);

  const handleSearch = () => {
    if (!isLogin) {
      modals.openConfirmModal({
        modalId: "login_confirm",
        centered: true,
        title: "알림",
        children: <Text>로그인 후에 이용 가능합니다.</Text>,
        labels: { confirm: "로그인하기", cancel: "취소" },
        onConfirm: () => navigate("/login"),
      });
      return;
    }

    applySearch();
  };

  return (
    <Flex
      h={"100%"}
      w={"90%"}
      direction={"column"}
      pt={"lg"}
      mx="auto"
      mt={"md"}
    >
      {/* 필터 섹션 */}

      <Box mb="xl" style={{ borderBottom: "1px solid gray" }}>
        {/* 종료 여부 */}
        {/* 검색 */}
        <Flex my={"xl"}>
          <Box>
            <Title size="sm" w={500} mb={"md"}>
              마감일
            </Title>
            <Group>
              <DatePickerInput
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
          </Box>

          <Box>
            <Title size="sm" w={500} mb={"md"}>
              키워드 검색
            </Title>
            <Group>
              <TextInput
                name="search"
                placeholder="검색어를 입력하세요"
                value={filters.search}
                onChange={handleFilterChange}
                miw={300}
                w={"33%"}
              />
              <Button onClick={handleSearch} miw={150} flex={1}>
                검색
              </Button>
            </Group>
          </Box>
        </Flex>

        {/* 카테고리 체크박스 */}
        <Title size="sm" w={500} mb={"md"}>
          카테고리
        </Title>
        <Flex wrap="wrap" align={"center"} mb={"xl"}>
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

      <Box>
        {data?.pages[0].totalElements === 0 && (
          <Title ta={"center"} order={2} mt="xl">
            검색 결과가 없습니다.
          </Title>
        )}
        {isLogin ? (
          <SimpleGrid cols={3} spacing={50}>
            {isLogin}
            {data?.pages?.map((page) =>
              page.content.map((item) => (
                <BalanceCard key={item.questionId} data={item} />
              ))
            )}
          </SimpleGrid>
        ) : (
          <Dummy />
        )}
        <Box ref={observerRef} bg={"transparent"} h={30} />

        <Flex justify={"center"}>
          {isFetchingNextPage && <Loader size={"xl"} />}
        </Flex>
      </Box>
    </Flex>
  );
};

export default React.memo(PCBalanceGameList);
