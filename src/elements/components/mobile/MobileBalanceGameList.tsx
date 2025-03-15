// MobileBalanceGameList.jsx - 모바일용 밸런스 게임 리스트 컴포넌트

import { DummyData } from "@/elements/templates/MainHomeTemplate";
import { useBalanceGameList } from "@/hooks/useBalanceGameList";
import { useUserStore } from "@/libs/store/store";
import { CATEGORIES } from "@/libs/utils/serviceConstants";
import {
  Button,
  Checkbox,
  Container,
  Flex,
  Group,
  Loader,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import BalanceCard from "../BalanceCard";
import { useRef, useEffect } from "react";

const MobileBalanceGameList = () => {
  const { isLogin } = useUserStore();
  const {
    filters,
    data,
    isLoading,
    handleFilterChange,
    handleDateChange,
    handleCategoryChange,
    applySearch,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useBalanceGameList(isLogin, 10);
  const [opened, { toggle, close }] = useDisclosure(false);

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
    <Container size="xl" py="md" maw="100%">
      <Button
        onClick={toggle}
        fullWidth
        variant="light"
        pos={"sticky"}
        top={10}
        opacity={1}
        style={{ zIndex: 10, outline: "none" }}
        mb={30}
      >
        🔍 검색
      </Button>

      {/* 모달 UI */}
      <Modal opened={opened} onClose={close} title="필터 설정" centered>
        {/* 검색 필드 */}
        <TextInput
          name="search"
          placeholder="검색어를 입력하세요"
          value={filters.search}
          onChange={handleFilterChange}
          w={"100%"}
        />

        {/* 종료 여부 */}
        <Title size="sm" mt={20}>
          마감일
        </Title>
        <Group mt={10} mb={10}>
          <DatePickerInput
            clearable
            maxLevel="month"
            dropdownType="modal"
            valueFormat="YYYY-MM-DD"
            placeholder="날짜 선택"
            value={filters.startDate}
            onChange={(v: any) => handleDateChange(v, "startDate")}
            locale="ko"
            w={"43%"}
          />
          <Text>~</Text>
          <DatePickerInput
            maxLevel="month"
            clearable
            dropdownType="modal"
            valueFormat="YYYY-MM-DD"
            placeholder="날짜 선택"
            value={filters.endDate}
            onChange={(v: any) => handleDateChange(v, "endDate")}
            locale="ko"
            w={"43%"}
          />
        </Group>
        <Checkbox
          name="showEnded"
          label="마감된 게임 포함"
          checked={filters.showEnded}
          onChange={handleFilterChange}
          mt={10}
        />

        {/* 카테고리 체크박스 */}
        <Title size="sm" mt={20}>
          카테고리
        </Title>
        <Flex wrap="wrap" align="center" mt={10}>
          {CATEGORIES.map((category) => (
            <Checkbox
              value={category.value}
              key={category.value}
              label={category.label}
              checked={filters.categories.includes(category.value)}
              onChange={handleCategoryChange}
              mr={10}
            />
          ))}
        </Flex>

        {/* 필터 적용 버튼 */}
        <Button
          fullWidth
          mt={20}
          onClick={() => {
            applySearch();
            close();
          }}
        >
          적용하기
        </Button>
      </Modal>

      {isLogin ? (
        <Stack>
          {isLogin}
          {data?.pages?.map((page) =>
            page.content.map((item) => (
              <BalanceCard key={item.questionId} data={item} />
            ))
          )}
          {/* ✅ 마지막 요소 감지용 div */}
          <div
            ref={observerRef}
            style={{ height: 10, background: "transparent" }}
          />
          {(isFetchingNextPage || isLoading) && (
            <Flex justify={"center"}>
              <Loader />
            </Flex>
          )}
        </Stack>
      ) : (
        <DummyData cols={1} spacing={25} repeat={6} />
      )}
    </Container>
  );
};

export default MobileBalanceGameList;
