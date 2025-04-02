export const ACCEES_TOKEN = "acceesToken";

export enum CategoryValue {
  ALL = "",
  DAILY = "30000001",
  FOOD = "30000002",
  SELF_IMPROVEMENT = "30000003",
  RELATIONSHIPS = "30000004",
  MISC = "30000005",
}

interface Category {
  value: CategoryValue;
  label: string;
}

export const CATEGORIES: Category[] = [
  { value: CategoryValue.DAILY, label: "일상" },
  { value: CategoryValue.FOOD, label: "음식" },
  { value: CategoryValue.SELF_IMPROVEMENT, label: "자기계발" },
  { value: CategoryValue.RELATIONSHIPS, label: "인간관계" },
  { value: CategoryValue.MISC, label: "기타" },
];

export enum QuestionStatusCd {
  PROGRESS = "20000001",
  END = "20000002",
  WAITING = "20000003",
}
