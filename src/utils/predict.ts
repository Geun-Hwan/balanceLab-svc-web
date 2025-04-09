import { IPredictResult } from "@/service/predictApi";

export const calculatePercentage = (data: IPredictResult, count: number) => {
  if (count === 0) return 0; // 선택하지 않은 경우

  const total = data.countA + data.countB + data.countC; // 총합계
  const percent = (count / total) * 100;

  return Number.isInteger(percent) ? percent : parseFloat(percent.toFixed(1));
};
