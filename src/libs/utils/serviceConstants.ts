export const ACCEES_TOKEN = "acceesToken";

export const CustomError = {
  ACCESS_TOKEN_EXPIRED: "AUTH_ERROR1",
  SESSION_EXPIRED: "AUTH_ERROR2",
  PASSWORD_ERROR: "AUTH_ERROR3",
  NO_DATA: "SVC_ERROR1",
  EMAIL_ALREADY_REGISTERED: "SVC_ERROR2",
  EMAIL_NOT_FOUND: "SVC_ERROR3",
  EMAIL_SEND_FAILED: "SVC_ERROR4",
  INVALID_VERIFICATION_CODE: "SVC_ERROR5",
};

interface Category {
  value: string;
  label: string;
}

export const CATEGORIES: Category[] = [
  { value: "", label: "전체" },
  { value: "30000001", label: "일상" }, // DAILY
  { value: "30000002", label: "음식" }, // FOOD
  { value: "30000003", label: "자기계발" }, // SELF_IMPROVEMENT
  { value: "30000004", label: "인간관계" }, // RELATIONSHIPS
  { value: "30000005", label: "기타" }, // MISC
];

export enum QuestionStatusCd {
  PROGRESS = "20000001",
  END = "20000002",
  WAITING = "20000003",
}
