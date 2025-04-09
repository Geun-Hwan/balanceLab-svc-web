import { CATEGORIES, CategoryValue } from "@/constants/ServiceConstants";

export const getCategoryName = (categoryCd: CategoryValue) => {
  const category = CATEGORIES.find((cat) => cat.value === categoryCd);
  return category ? category.label : "기타";
};
