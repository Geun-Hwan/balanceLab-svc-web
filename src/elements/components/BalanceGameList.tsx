import {
  Box,
  Button,
  Checkbox,
  Flex,
  Group,
  Loader,
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
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BalanceCard from "./BalanceCard";
import useContentType from "@/hooks/useContentType";
import MobileBalanceGameSearchButton from "./mobile/MobileBalanceGameSearchButton";
import PcBalanceGameSearchArea from "./pc/PcBalanceGameSearchArea";

const BalanceGameList = () => {
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
  } = useBalanceGameList(30);

  const observerRef = useRef<HTMLDivElement | null>(null);

  const [colSize, setColsize] = useState(3);

  // ✅ IntersectionObserver를 사용한 자동 로딩
  useEffect(() => {
    if (!observerRef.current) return;
    if (isFetchingNextPage) return;
    const currentRef = observerRef.current; // ref 값을 변수에 저장
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
    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

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

      {isSmall ? (
        <MobileBalanceGameSearchButton
          filters={filters}
          handleDateChange={handleDateChange}
          handleFilterChange={handleFilterChange}
          applySearch={handleSearch}
          handleCategoryChange={handleCategoryChange}
          defaultValue={defaultValue}
          setFilters={setFilters}
        />
      ) : (
        <PcBalanceGameSearchArea
          filters={filters}
          handleDateChange={handleDateChange}
          handleFilterChange={handleFilterChange}
          applySearch={handleSearch}
          handleCategoryChange={handleCategoryChange}
        />
      )}
      <Box>
        {data?.pages[0].totalElements === 0 && (
          <Title ta={"center"} order={2} mt="xl">
            검색 결과가 없습니다.
          </Title>
        )}
        {isLogin ? (
          <SimpleGrid cols={colSize} spacing={50}>
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

export default React.memo(BalanceGameList);
