import {
  Box,
  Flex,
  Loader,
  SimpleGrid,
  Skeleton,
  Text,
  Title,
} from "@mantine/core";

import { useBalanceGameList } from "@/hooks/useBalanceGameList";
import useContentType from "@/hooks/useContentType";
import { useUserStore } from "@/store/store";
import { modals } from "@mantine/modals";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BalanceCard from "./BalanceCard";
import DummyComponent from "./DummyComponent";
import MobileBalanceGameSearchButton from "./mobile/MobileBalanceGameSearchButton";
import PcBalanceGameSearchArea from "./pc/PcBalanceGameSearchArea";

const BalanceGameContent = () => {
  const { isLogin } = useUserStore();
  const navigate = useNavigate();
  const { isSmall, isMidium, isExtra } = useContentType();
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
    defaultValue,
    setFilters,
    isLoading,
  } = useBalanceGameList(isLogin, 18);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const [colSize, setColsize] = useState(0);

  // ✅ IntersectionObserver를 사용한 자동 로딩
  useEffect(() => {
    if (isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          if (fetchNextPage) {
            fetchNextPage();
          }
        }
      },
      { threshold: 0.5 }
    );

    if (!isLoading) {
      if (isInitialLoading) {
        setIsInitialLoading(false);
      }
    }
    if (!observerRef.current) return;
    const currentRef = observerRef.current; // ref 값을 변수에 저장

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [isFetchingNextPage, hasNextPage, fetchNextPage, isLoading]);

  useEffect(() => {
    if (isExtra) {
      setColsize(3);
      return;
    } else if (isMidium) {
      setColsize(2);
      return;
    } else if (isSmall) {
      setColsize(1);
      return;
    }
  }, [isSmall, isMidium, isExtra]);

  const handleSearch = () => {
    if (!isLogin) {
      modals.openConfirmModal({
        modalId: "login_confirm",
        centered: true,
        title: "알림",
        children: <Text>로그인 후에 이용 가능합니다.</Text>,
        labels: { confirm: "로그인하기", cancel: "취소" },
        onConfirm: () => navigate("/login"),
        lockScroll: false,
      });
      if (setFilters) {
        if (defaultValue) {
          setFilters(defaultValue);
        }
      }
      return;
    }

    applySearch();
  };

  if (colSize === 0) {
    return;
  }

  return (
    <Flex w={"100%"} direction={"column"}>
      {/* 필터 섹션 */}

      {isSmall ? (
        <MobileBalanceGameSearchButton
          filters={filters}
          handleDateChange={handleDateChange}
          handleFilterChange={handleFilterChange}
          applySearch={handleSearch}
          handleCategoryChange={handleCategoryChange}
          setFilters={setFilters}
        />
      ) : (
        <PcBalanceGameSearchArea
          filters={filters}
          handleDateChange={handleDateChange}
          handleFilterChange={handleFilterChange}
          applySearch={handleSearch}
          handleCategoryChange={handleCategoryChange}
          setFilters={setFilters}
          isLoading={isLoading}
        />
      )}

      {data?.pages[0].totalElements === 0 && (
        <Title ta={"center"} order={2} mt="xl">
          검색 결과가 없습니다.
        </Title>
      )}
      <Box mt={"xl"}>
        {isInitialLoading ? (
          <DummyComponent cols={colSize} isLoading={true} />
        ) : (
          <SimpleGrid cols={colSize} spacing={50}>
            {data?.pages?.map((page) =>
              page.content.map((item) => (
                <BalanceCard key={item.questionId} data={item} />
              ))
            )}
          </SimpleGrid>
        )}
      </Box>
      <Box ref={observerRef} bg={"transparent"} h={30} />

      <Flex justify={"center"}>
        {isFetchingNextPage && <Loader size={"xl"} />}
      </Flex>
    </Flex>
  );
};

export default BalanceGameContent;
