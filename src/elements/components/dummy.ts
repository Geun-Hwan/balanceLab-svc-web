import { IQuestionResult } from "@/service/questionApi";
import dayjs from "dayjs";

const HANGUL_START = 0xac00; // 가
const HANGUL_END = 0xd7a3; // 힣

export type dummyType = "balance" | "predict";

const generateRandomHangulWithSpaces = (
  minLength: number,
  maxLength: number
) => {
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  let result = "";
  for (let i = 0; i < length; i++) {
    // 1/5 확률로 띄어쓰기를 추가
    if (Math.random() < 0.2) {
      result += " "; // 띄어쓰기 추가
    } else {
      const randomCode =
        Math.floor(Math.random() * (HANGUL_END - HANGUL_START + 1)) +
        HANGUL_START;
      result += String.fromCharCode(randomCode); // 랜덤 한글 문자 추가
    }
  }
  return result;
};

export const getBalanceDummyData = () => {
  const randomTitle = generateRandomHangulWithSpaces(10, 35);

  const dummyData = {
    strDate: dayjs(),
    endDate: dayjs(),
    title: randomTitle,
  } as IQuestionResult;

  return dummyData;
};

export const getPredictDummyData = () => {
  const randomTitle = generateRandomHangulWithSpaces(10, 35);

  const dummyData = {
    strDate: dayjs(),
    endDate: dayjs(),
    title: randomTitle,
  };

  return dummyData;
};
