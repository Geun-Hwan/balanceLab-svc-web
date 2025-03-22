import { QuestionStatusCd } from "../constants/serviceConstants";
import { instance } from "./api";

export type QuestionRequestType = {
  page?: number | string;
  pageSize?: number | string;
  questionId?: string;
  search?: string;
  categories?: string;
  startDate?: string;
  endDate?: string;
  showEnded?: boolean;
  public?: boolean;
  isMine?: boolean;
  isParticipation?: boolean;
};

export type QuestionCreateType = {
  title: string;
  choiceA: string;
  choiceB: string;
  strDate?: string;
  endDate?: string;
  categoryCd: string | null;
  questionStatusCd: string;
  point?: number;
  usedPoint?: number;

  questionId?: string;
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
  categoryCd: string;
  imgUrlA: string | null;
  imgUrlB: string | null;

  delYn: boolean; //삭제여부
  questionStatusCd: QuestionStatusCd; // 선택지상태
  participation: boolean;
  choiceType: "A" | "B" | null; // 내 선택

  selectA: number; // A 총 선택인원
  selectB: number; // B 총 선택인원
  participationDtm: string | Date;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  last: boolean;
}

const PRE_FIX = "/question";

export const getQuestionKey = (params: QuestionRequestType = {}) => {
  return Object.keys(params).length > 0
    ? ["question", JSON.stringify(Object.entries(params).sort())]
    : ["question"];
};
export const getQuestionList = async (
  param: QuestionRequestType
): Promise<PageResponse<IQuestionResult>> => {
  return instance
    .get<PageResponse<IQuestionResult>>(PRE_FIX, param)
    .then((res) => res.data.data);
};

export const getMyQuestionList = async (
  param: QuestionRequestType
): Promise<PageResponse<IQuestionResult>> => {
  return instance
    .get<PageResponse<IQuestionResult>>(PRE_FIX + "/my", param)
    .then((res) => res.data.data);
};

export const getParticipationList = async (
  param: QuestionRequestType
): Promise<PageResponse<IQuestionResult>> => {
  return instance
    .get<PageResponse<IQuestionResult>>(PRE_FIX + `/participation`, param)
    .then((res) => res.data.data);
};

export const getQuestionDetail = async (
  questionId: string
): Promise<IQuestionResult> => {
  return instance
    .get<IQuestionResult>(PRE_FIX + `/${questionId}`)
    .then((res) => res.data.data);
};

export const getPublicQuestion = async (): Promise<IQuestionResult> => {
  return instance
    .get<IQuestionResult>(PRE_FIX + `/public`)
    .then((res) => res.data.data);
};

export const createQuestion = async (
  param: QuestionCreateType
): Promise<any> => {
  return instance.post<any>(PRE_FIX, param).then((res) => res.data.data);
};

export const modifyQuestion = async (
  param: QuestionCreateType
): Promise<number> => {
  return instance.put<number>(PRE_FIX, param).then((res) => res.data.data);
};

export const removeQuestion = async (questionId: string): Promise<number> => {
  return instance
    .delete<number>(PRE_FIX + `/${questionId}`)
    .then((res) => res.data.data);
};
