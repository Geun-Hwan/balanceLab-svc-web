import { MAX_PAGE_FOR_GUEST } from "@/constants/ServiceConstants";
import useContentType from "@/hooks/useContentType";
import { getPredictionKey } from "@/service/predictApi";
import { getPublicPredictList } from "@/service/publicApi";
import { useUserStore } from "@/store/store";
import DummyComponent from "@cmp/DummyComponent";
import { Box, Flex, Loader, SimpleGrid } from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import PredictCard from "./PredictCard";

const PredictContents = () => {
  const { isLogin } = useUserStore();
  const { isExtra, isMidium, isSmall } = useContentType();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: getPredictionKey(),
    queryFn: ({ pageParam }) =>
      getPublicPredictList({
        page: pageParam,
        pageSize: isLogin ? 18 : 9,
      }),
    initialPageParam: 0,

    getNextPageParam: (lastPage, _allPages) => {
      if (!lastPage?.last) {
        const nextPage = lastPage.number + 1;
        if (!isLogin && nextPage >= MAX_PAGE_FOR_GUEST) {
          return undefined;
        }
        return nextPage;
      }

      return undefined;
    },
  });
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

  return (
    <Flex w={"100%"} direction={"column"}>
      <Box mt={"xl"}>
        {isInitialLoading ? (
          <DummyComponent cols={colSize} type="predict" isLoading={true} />
        ) : (
          <SimpleGrid cols={colSize} spacing={50}>
            {data?.pages?.map((page) =>
              page.content.map((item) => (
                <PredictCard key={item.predictId} data={item} />
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

export default PredictContents;
