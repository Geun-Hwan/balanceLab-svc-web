import { instance } from "@/service/api";
import { IQuestionResult, QuestionRequestType } from "./questionApi";
import { SelectionCreateType } from "./selectionApi";
import { IPredictResult, PredictRequestType } from "./predictApi";

const PRE_FIX = "/public";

const RANK = "/rank";

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
}

export type RankType = "daily" | "weekly" | "monthly";

export const getPublicPredictList = async (
  param: PredictRequestType
): Promise<PageResponse<IPredictResult>> => {
  return instance
    .get<PageResponse<IPredictResult>>(PRE_FIX + "/predict", param)
    .then((res) => res.data.data);
};

export const getRankList = async (
  type: RankType
): Promise<IQuestionResult[]> => {
  return instance
    .get<IQuestionResult[]>(`${PRE_FIX}${RANK}/${type}`)
    .then((res) => res.data.data);
};

export const getTodayQuestion = async (): Promise<IQuestionResult[]> => {
  return instance
    .get<IQuestionResult[]>(`${PRE_FIX}/today`)
    .then((res) => res.data.data);
};

export const getQuestionList = async (
  param: QuestionRequestType
): Promise<PageResponse<IQuestionResult>> => {
  return instance
    .get<PageResponse<IQuestionResult>>(PRE_FIX, param)
    .then((res) => res.data.data);
};

export const getQuestionDetail = async (
  questionId: string
): Promise<IQuestionResult> => {
  return instance
    .get<IQuestionResult>(PRE_FIX + `/${questionId}`)
    .then((res) => res.data.data);
};

export const updateQuestionTotal = async (
  param: SelectionCreateType
): Promise<any> => {
  return instance
    .put<any>(PRE_FIX + `/selection`, param)
    .then((res) => res.data.data);
};
