import { CategoryValue } from "@/constants/serviceConstants";
import etcA from "@asset/images/etcA.png";
import etcB from "@asset/images/etcB.png";

export const getDefaultImage = (
  cate: CategoryValue,
  type: "A" | "B",
  imageUrl?: string | null
) => {
  if (imageUrl) {
    return imageUrl;
  }

  switch (cate) {
    case CategoryValue.DAILY:
      break;
    case CategoryValue.FOOD:
      break;
    case CategoryValue.SELF_IMPROVEMENT:
      break;
    case CategoryValue.RELATIONSHIPS:
      break;
    case CategoryValue.MISC:
      return type === "A" ? etcA : etcB;
    default:
      return type === "A" ? etcA : etcB;
  }
};
