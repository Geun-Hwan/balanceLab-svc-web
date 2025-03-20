// MobileBalanceGameList.jsx - 모바일용 밸런스 게임 리스트 컴포넌트

import { CATEGORIES } from "@/constants/serviceConstants";

import { useBalanceGameList } from "@/hooks/useBalanceGameList";
import { useUserStore } from "@/store/store";
import Dummy from "@cmp/Dummy";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import BalanceCard from "../BalanceCard";
import FloatingButton from "@cmp/FloatingButton";

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
  } = useBalanceGameList(10);
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const observerRef = useRef<HTMLDivElement | null>(null);

  // ✅ IntersectionObserver를 사용한 자동 로딩
  useEffect(() => {
    if (!observerRef.current) return;

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
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleOpen = () => {
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
    open();
  };
  return (
    <Flex h={"100%"} w={"100%"} direction={"column"}>
      <Button
        onClick={handleOpen}
        fullWidth
        variant="light"
        opacity={1}
        style={{ zIndex: 10, outline: "none" }}
        mb={"md"}
      >
        🔍 검색
      </Button>

      {/* 모달 UI */}
      <Modal
        closeOnEscape={false}
        opened={opened}
        onClose={close}
        title="필터 설정"
        centered
      >
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
            maxLevel="month"
            dropdownType="modal"
            valueFormat="YYYY-MM-DD"
            placeholder="날짜 선택"
            value={filters.startDate}
            onChange={(v: any) => handleDateChange(v, "startDate")}
            locale="ko"
            flex={1}
          />
          <Text>~</Text>
          <DatePickerInput
            maxLevel="month"
            dropdownType="modal"
            valueFormat="YYYY-MM-DD"
            placeholder="날짜 선택"
            value={filters.endDate}
            onChange={(v: any) => handleDateChange(v, "endDate")}
            locale="ko"
            flex={1}
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
        <Flex
          wrap="wrap"
          align="center"
          mt={10}
          gap="md" // Flex 항목 사이의 간격
        >
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

      <Box>
        {data?.pages[0].totalElements === 0 && (
          <Title ta={"center"} order={2} mt="xl">
            검색 결과가 없습니다.
          </Title>
        )}
        {isLogin ? (
          <Stack>
            {isLogin}
            {data?.pages?.map((page) =>
              page.content.map((item) => (
                <BalanceCard key={item.questionId} data={item} />
              ))
            )}
            {/* ✅ 마지막 요소 감지용 div */}
          </Stack>
        ) : (
          <Dummy cols={1} spacing={25} repeat={6} />
        )}
        <Box ref={observerRef} bg={"transparent"} h={1} />

        {<Flex justify={"center"}>{isFetchingNextPage && <Loader />}</Flex>}
      </Box>
    </Flex>
  );
};

export default MobileBalanceGameList;
