import { instance } from "./api";

const PRE_FIX = "/user";

export type UserRequestType = {
  totalPoint?: boolean;
};

export type UserModifyType = {
  nickName?: string;
  password?: string;
  newPassword?: string;
};

export const getUserKey = (params: UserRequestType = {}) => {
  return Object.keys(params).length > 0
    ? ["user", JSON.stringify(Object.entries(params).sort())]
    : ["user"];
};

export const getTotalPoint = async (): Promise<number> => {
  return instance
    .get<number>(PRE_FIX + `/totalPoint`)
    .then((res) => res.data.data);
};

export const modifyUser = async (params: UserModifyType): Promise<number> => {
  return instance.put<number>(PRE_FIX, params).then((res) => res.data.data);
};

export const withdrawUser = async (): Promise<number> => {
  return instance
    .put<number>(PRE_FIX + "/withdraw")
    .then((res) => res.data.data);
};
