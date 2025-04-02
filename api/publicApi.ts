import { instance } from "@api/api";
import { IQuestionResult } from "./questionApi";

const PRE_FIX = "/public";

const RANK = "/rank";

export type RankType = "daily" | "weekly" | "monthly";

export const getPublicQuestionList = async (): Promise<IQuestionResult[]> => {
  return instance.get<IQuestionResult[]>(PRE_FIX).then((res) => res.data.data);
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
