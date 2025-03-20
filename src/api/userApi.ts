import { instance } from "./api";

const PRE_FIX = "/user";

export type UserRequestType = {
  totalPoint?: boolean;
};

export const getUserKey = (params: UserRequestType = {}) => {
  return Object.keys(params).length > 0
    ? ["user", JSON.stringify(Object.entries(params).sort())]
    : ["user"];
};

export const getTotalPoint = async (): Promise<number> => {
  return instance
    .get<number>(PRE_FIX + `/totalPoint`, {})
    .then((res) => res.data.data);
};
