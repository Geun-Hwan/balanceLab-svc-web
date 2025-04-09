import { QuestionStatusCd } from "@/constants/ServiceConstants";
import { instance } from "@/service/api";
import { PageResponse } from "./publicApi";

export type PredictRequestType = {
  page?: number | string;
  pageSize?: number | string;
  predictId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  showEnded?: boolean;
  isMine?: boolean;
  isParticipation?: boolean;
};

export type PredictCreateType = {
  title: string;
  optionA: string;
  optionB: string;
  optionC?: string;
  strDtm?: string;
  endDtm?: string;
  questionStatusCd: string;
  predictId?: string;
  usedPoint?: number;
};

export interface IPredictResult {
  isBlur: boolean | undefined;
  predictId: string;
  title: string; //제목
  userId: string;
  optionA: string; //선택지
  optionB: string; //선택지
  optionC?: string; //선택지

  strDtm: any; //시작시간
  endDtm: any; //종료시간

  delYn: boolean; //삭제여부
  questionStatusCd: QuestionStatusCd; // 선택지상태
  participation: boolean;

  choiceType: "A" | "B" | "C"; // 내 선택
  winner: "A" | "B" | "C" | null; // 예측 결과
  countA: number; // A 총 선택인원
  countB: number; // B 총 선택인원
  countC: number; // C 총 선택인원

  sumPointA: number;
  sumPointB: number;
  sumPointC: number;

  totalPoints: number;

  payoutA?: number;
  payoutB?: number;
  payoutC?: number;

  betPoint?: number;
  rewardPoint?: number;

  participationDtm?: string | Date;
}

const PRE_FIX = "/predict";

export const getPredictionKey = (params: PredictRequestType = {}) => {
  return Object.keys(params).length > 0
    ? ["predict", JSON.stringify(Object.entries(params).sort())]
    : ["predict"];
};

export const getMyPredictionList = async (
  param: PredictRequestType
): Promise<PageResponse<IPredictResult>> => {
  return instance
    .get<PageResponse<IPredictResult>>(PRE_FIX + "/my", param)
    .then((res) => res.data.data);
};

export const getPredictParticipationList = async (
  param: PredictRequestType
): Promise<PageResponse<IPredictResult>> => {
  return instance
    .get<PageResponse<IPredictResult>>(PRE_FIX + `/participation`, param)
    .then((res) => res.data.data);
};

export const createPredict = async (param: PredictCreateType): Promise<any> => {
  return instance.post<any>(PRE_FIX, param).then((res) => res.data.data);
};

export const modifyPredict = async (
  param: PredictCreateType
): Promise<number> => {
  return instance.put<number>(PRE_FIX, param).then((res) => res.data.data);
};

export const removePredict = async (predictId: string): Promise<number> => {
  return instance
    .delete<number>(PRE_FIX + `/${predictId}`)
    .then((res) => res.data.data);
};

export const modifyPredictTotal = async (param: {
  winner: "A" | "B" | "C";
  predictId: string;
}): Promise<number> => {
  return instance
    .put<number>(PRE_FIX + "/result", param)
    .then((res) => res.data.data);
};

export const removePredictParticipation = async (
  predictId: string
): Promise<number> => {
  return instance
    .delete<number>(PRE_FIX + `/participation/${predictId}`)
    .then((res) => res.data.data);
};
