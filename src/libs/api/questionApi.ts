import { instance } from "../api";
import { QuestionStatusCd } from "../utils/serviceConstants";

type QuestionRequestType = {
  page?: number | string;
  pageSize?: number | string;
  questionId?: string;
  search?: string;
  categories?: string;
  startDate?: string;
  endDate?: string;
  showEnded?: boolean;
};

export interface IQuestionResult {
  questionId: string;
  title: string; //제목
  userId: string;
  choiceA: string; //선택지
  choiceB: string; //선택지
  point: number; //참여시 지급 포인트

  strDate: any; //시작시간
  endDate: any; //종료시간
  questionStatusCd: QuestionStatusCd; // 선택지상태
  participation: boolean;
  choiceType: "A" | "B" | null; // 내 선택

  selectA: number; // A 총 선택인원
  selectB: number; // B 총 선택인원
}

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
}

export const getQuestionKey = (params: QuestionRequestType = {}) => {
  return Object.keys(params).length > 0
    ? ["question", JSON.stringify(Object.entries(params).sort())]
    : ["question"];
};
export const getQuestionList = async (
  param: QuestionRequestType
): Promise<PageResponse<IQuestionResult>> => {
  return instance
    .get<PageResponse<IQuestionResult>>(`/question`, param)
    .then((res) => res.data.data);
};

export const getQuestionDetail = async (
  questionId: string
): Promise<IQuestionResult> => {
  return instance
    .get<IQuestionResult>(`/question/${questionId}`)
    .then((res) => res.data.data);
};
