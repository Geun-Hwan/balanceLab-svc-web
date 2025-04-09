import { instance } from "@/service/api";

export type SelectionCreateType = {
  questionId: string;
  choiceType: "A" | "B";
  rewardPoint?: number;
};

export type BettingCreateType = {
  predictId: string;
  choiceType: "A" | "B" | "C";
  betPoint?: number;
};

// export interface ISelectResult {}

export const createSelection = async (
  param: SelectionCreateType
): Promise<any> => {
  return instance.post<any>(`/selection`, param).then((res) => res.data.data);
};

export const createBetting = async (param: BettingCreateType): Promise<any> => {
  return instance
    .post<any>(`/selection/betting`, param)
    .then((res) => res.data.data);
};
