import { instance } from "@/service/api";

const PRE_FIX = "/mail";
export const verifyMailSend = async (param: {
  email: string;
}): Promise<Date> => {
  return instance
    .post<Date>(PRE_FIX + `/send/verify`, param)
    .then((res) => res.data.data);
};

export const verifyCheck = async (param: {
  email: string;
  verifyCode: string;
}): Promise<any> => {
  return instance
    .post<boolean>(PRE_FIX + `/verify/check`, param)
    .then((res) => res.data.data);
};
