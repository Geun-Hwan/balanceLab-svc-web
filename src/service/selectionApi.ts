import { instance } from "@/service/api";

export type SelectionCreateType = {
  questionId: string;
  choiceType: "A" | "B";
  rewardPoint?: number;
};

export type SelectionReqeustType = {
  choiceType: "A" | "B" | null;
};

// export interface ISelectResult {}

export const createSelection = async (
  param: SelectionCreateType
): Promise<any> => {
  return instance.post<any>(`/selection`, param).then((res) => res.data.data);
};

export const getSelectionList = async (
  param: SelectionReqeustType
): Promise<Array<any>> => {
  return instance
    .get<Array<any>>(`/selection`, param)
    .then((res) => res.data.data);
};
