import { MAX_PAGE_FOR_GUEST } from "@/constants/ServiceConstants";
import useContentType from "@/hooks/useContentType";
import { getPredictionKey, IPredictResult } from "@/service/predictApi";
import { getPublicPredictList } from "@/service/publicApi";
import { useAlertStore, useUserStore } from "@/store/store";
import DummyComponent from "@cmp/DummyComponent";
import { Box, Flex, Loader, SimpleGrid, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import PredictBetMadal from "./PredictBetMadal";
import PredictCard from "./PredictCard";
import { Helmet } from "react-helmet-async";

const PredictContents = () => {
  const { isLogin } = useUserStore();
  const { isExtra, isMidium, isSmall } = useContentType();

  const { showAlert } = useAlertStore();

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

  const [detailOpend, { open, close }] = useDisclosure(false);

  const [isInitialLoading, setIsInitialLoading] = useState(true);

  const [colSize, setColsize] = useState(0);
  const [modalData, setModalData] = useState<IPredictResult | null>(null);

  const handleClick = (prediction: IPredictResult) => {
    // 수정 기능 구현
    if (!isLogin) {
      showAlert("로그인 후에 이용 가능합니다.");
      return;
    }

    flushSync(() => {
      setModalData(prediction); // 상태 업데이트를 동기적으로 처리
      open();
    });
  };
  const handleClose = () => {
    flushSync(() => {
      setModalData(null); // 상태 업데이트를 동기적으로 처리
      close();
    });
  };

  useEffect(() => {
    if (!isLoading && isInitialLoading) {
      setIsInitialLoading(false); // 데이터 한번 불러오면 false
    }
  }, [isLoading, isInitialLoading]);

  const setObserverRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return; // 초기 null 처리 (unmount 등)

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage)
            if (fetchNextPage) {
              fetchNextPage();
              observer.unobserve(entries[0].target);
            }
        },
        { threshold: 0.5 }
      );

      observer.observe(node);
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage, isLoading]
  );

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
    <>
      <Helmet>
        <title>결과 예측 게임 | Balance Factory</title>
        <meta
          name="description"
          content="특정 주제에 대한 결과를 예측하고, 그 예측이 맞았는지 확인해보세요! 다양한 주제에 대해 재미있는 예측을 즐기세요."
        />
        <meta property="og:title" content="결과 예측 게임 | Balance Factory" />
        <meta
          property="og:description"
          content="주어진 주제에 대해 예측을 하고, 그 결과를 확인해보세요. 여러분의 예측이 얼마나 정확한지 도전해보세요!"
        />
        <meta property="og:url" content="https://gugunan.ddns.net/predict" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Flex w={"100%"} direction={"column"}>
        {data?.pages[0].totalElements === 0 && (
          <Title ta={"center"} order={2} mt="xl">
            데이터가 존재하지 않습니다.
          </Title>
        )}
        <Box mt={"xl"}>
          {isInitialLoading ? (
            <DummyComponent cols={colSize} type="predict" isLoading={true} />
          ) : (
            <SimpleGrid cols={colSize} spacing={"xl"}>
              {data?.pages?.map((page) =>
                page.content.map((item) => (
                  <PredictCard
                    key={item.predictId}
                    data={item}
                    handleClick={handleClick}
                  />
                ))
              )}
            </SimpleGrid>
          )}
        </Box>
        <Box ref={setObserverRef} bg={"transparent"} h={30} />

        <Flex justify={"center"}>
          {isFetchingNextPage && <Loader size={"xl"} />}
        </Flex>

        <PredictBetMadal
          data={modalData as IPredictResult}
          opened={detailOpend}
          close={handleClose}
        />
      </Flex>
    </>
  );
};

export default PredictContents;
