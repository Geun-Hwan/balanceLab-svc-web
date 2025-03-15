import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  // queryCache: new QueryCache({
  //   onError: (error) => {
  //     console.log("error", error);
  //   },
  // }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분 동안 데이터 유지
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});
