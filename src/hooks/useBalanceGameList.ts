import {
  getQuestionKey,
  getQuestionList,
  IQuestionResult,
  PageResponse,
} from "@/api/questionApi";
import { useAlertStore } from "@/store/store";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

const searchParamsToObject = (searchParams: URLSearchParams) => {
  const params: { [key: string]: any } = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
};

export const useBalanceGameList = (isLogin: boolean, pageSize: number = 30) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [InfiniteData, setInfiniteData] = useState<
    InfiniteData<PageResponse<IQuestionResult>, unknown> | undefined
  >(undefined);

  const { showAlert } = useAlertStore();

  const [filters, setFilters] = useState<any>({
    search: "",
    categories: [""],
    startDate: dayjs(),
    endDate: dayjs().add(1, "month"),
    showEnded: false,
  });

  const memoParams = useMemo(
    () => searchParamsToObject(searchParams),
    [searchParams]
  );

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: getQuestionKey(memoParams),
    queryFn: ({ pageParam }) =>
      getQuestionList({
        page: pageParam,
        pageSize,
        search: memoParams.search || "", // null인 경우 빈 문자열로 처리
        categories: memoParams.categories || "", // null인 경우 빈 문자열로 처리
        startDate: memoParams.startDate || dayjs().format("YYYY-MM-DD"),
        endDate:
          memoParams.endDate || dayjs().add(1, "month").format("YYYY-MM-DD"),
        showEnded: memoParams.showEnded === "true",
      }),
    initialPageParam: 0,

    getNextPageParam: (lastPage, allPages) => {
      return !lastPage.last ? lastPage.number + 1 : undefined;
    },
    enabled: isLogin,
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.currentTarget;
    setFilters((prev: any) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDateChange = (value: string | null, field: string) => {
    const formattedDate = value ? dayjs(value) : null; // 날짜 형식을 "YYYYMMDD"로 처리

    setFilters((prev: any) => ({
      ...prev,
      [field]: formattedDate,
    }));
  };

  // 카테고리 체크박스 핸들러
  const handleCategoryChange = (e: any) => {
    const { value, checked } = e.currentTarget;
    setFilters((prevFilters: any) => {
      let newCategories = [...prevFilters.categories];

      // "전체" 카테고리가 선택되면 다른 카테고리들을 모두 해제
      if (value === "") {
        newCategories = checked ? [""] : [];
      } else {
        // 다른 카테고리가 선택되면 "전체"는 해제
        if (checked) {
          newCategories.push(value);
        } else {
          newCategories = newCategories.filter(
            (category) => category !== value
          );
        }

        // "전체" 체크박스는 해제
        newCategories = newCategories.filter((category) => category !== "");
      }

      if (newCategories.length === 0) {
        newCategories = [""];
      }

      return { ...prevFilters, categories: newCategories };
    });
  };

  // 필터 적용 함수
  const applySearch = () => {
    // 필터 적용 로직

    const start = filters.startDate;
    const end = filters.endDate;

    if (!start) {
      showAlert("시작일을 선택해주세요.", "warning");
      return;
    }

    if (!end) {
      showAlert("종료일을 선택해주세요.", "warning");
      return;
    }

    if (start.isAfter(end)) {
      showAlert("시작일은 종료일 이전이어야 합니다.", "warning");
      // 시작일을 종료일로 조정 (원하는 방식에 따라 선택)
      filters.startDate = end;
      setFilters(filters); // 상태 업데이트
      return;
    }

    const diffInDays = end.diff(start, "day");

    // 3개월(90일) 이상이면 차단
    if (diffInDays > 90) {
      showAlert("조회 기간은 최대 3개월까지 가능합니다.", "warning");
      return;
    }

    if (filters.search.length > 0) {
      const searchQuery = filters.search.trim();

      if (searchQuery.length < 2) {
        filters.search = "";
        showAlert("검색어는 최소 2글자 이상이어야 합니다.", "warning");
        setFilters(filters);
        return;
      }
    }

    const params = new URLSearchParams();
    params.set("search", filters.search);
    params.set("categories", filters.categories.join(","));
    params.set("startDate", start.format("YYYY-MM-DD"));
    params.set("endDate", end.format("YYYY-MM-DD"));
    params.set("showEnded", filters.showEnded ? "true" : "false");

    setSearchParams(params);
  };

  useEffect(() => {
    if (data) {
      setInfiniteData(data);
    }
  }, [data]);

  return {
    filters,
    data: InfiniteData,
    isLoading,
    handleFilterChange,
    handleDateChange,
    handleCategoryChange,
    applySearch,
    isFetchingNextPage,
    isFetching,
    fetchNextPage,
    hasNextPage,
  };
};
