import { instance } from "./api";
import { IQuestionResult } from "./questionApi";

const PRE_FIX = "/public";

export const getPublicQuestion = async (): Promise<IQuestionResult> => {
  return instance
    .get<IQuestionResult>(PRE_FIX + `/public`)
    .then((res) => res.data.data);
};
