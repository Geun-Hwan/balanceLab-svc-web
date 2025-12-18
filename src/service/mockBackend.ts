import { CategoryValue, QuestionStatusCd } from "@/constants/ServiceConstants";
import { AUTH_ERROR, GENERAL_ERROR, SVC_ERROR } from "@/constants/ErrorConstants";
import { getAccessToken } from "@/utils/cookieUtil";
import type { AxiosResponse } from "axios";
import type { IAPI_RESPONSE } from "./api";
import type { IPredictResult, PredictCreateType, PredictRequestType } from "./predictApi";
import type { IQuestionResult, QuestionCreateType, QuestionRequestType } from "./questionApi";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type MockRequest = {
  method: HttpMethod;
  url: string;
  params?: any;
  data?: any;
};

type MockUser = {
  userId: string;
  email: string;
  loginId: string;
  nickName: string;
  password: string;
  totalPoint: number;
};

const SUCCESS_CODE = "SUCCESS";
const ERROR_CODE = GENERAL_ERROR.BAD_REQUEST;

const nowIso = () => new Date().toISOString();

const ok = <T>(payload: T): AxiosResponse<IAPI_RESPONSE<T>> => {
  return {
    data: {
      data: payload,
      status: 200,
      code: SUCCESS_CODE,
      message: "",
    },
    status: 200,
    statusText: "OK",
    headers: {},
    config: {} as any,
  };
};

const err = (message: string, status = 400, code = ERROR_CODE): AxiosResponse<IAPI_RESPONSE<any>> => {
  return {
    data: {
      data: null,
      status,
      code,
      message,
    },
    status,
    statusText: "Error",
    headers: {},
    config: {} as any,
  };
};

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

const categoryPool: CategoryValue[] = [
  CategoryValue.DAILY,
  CategoryValue.FOOD,
  CategoryValue.SELF_IMPROVEMENT,
  CategoryValue.RELATIONSHIPS,
  CategoryValue.MISC,
  CategoryValue.ADULT,
];

const makeQuestion = (index: number, overrides: Partial<IQuestionResult> = {}): IQuestionResult => {
  const baseId = 1000 + index;
  const start = new Date(Date.now() - (index % 14) * 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + ((index % 10) + 1) * 24 * 60 * 60 * 1000);

  const isEnded = index % 7 === 0;
  const questionStatusCd = isEnded ? QuestionStatusCd.END : QuestionStatusCd.PROGRESS;

  return {
    isBlur: false,
    questionId: `QST${baseId}`,
    title: `밸런스 질문 ${baseId}: ${pick(["치킨 vs 피자", "아침형 vs 저녁형", "여름 vs 겨울", "강아지 vs 고양이"])}`,
    enTitle: `Balance Question ${baseId}`,
    userId: "U001",
    choiceA: pick(["A 선택지", "치킨", "아침형", "여름", "강아지"]),
    choiceB: pick(["B 선택지", "피자", "저녁형", "겨울", "고양이"]),
    enChoiceA: "Option A",
    enChoiceB: "Option B",
    point: 50 + (index % 10) * 10,
    strDate: start.toISOString(),
    endDate: isEnded ? new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() : end.toISOString(),
    categoryCd: pick(categoryPool),
    imgUrlA: null,
    imgUrlB: null,
    delYn: false,
    questionStatusCd,
    participation: false,
    choiceType: null,
    selectA: Math.floor(Math.random() * 1000),
    selectB: Math.floor(Math.random() * 1000),
    participationDtm: nowIso(),
    ...overrides,
  };
};

const makePredict = (index: number, overrides: Partial<IPredictResult> = {}): IPredictResult => {
  const baseId = 2000 + index;
  const start = new Date(Date.now() - (index % 10) * 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + ((index % 7) + 1) * 24 * 60 * 60 * 1000);
  const isEnded = index % 9 === 0;

  return {
    isBlur: false,
    predictId: `PRD${baseId}`,
    title: `예측 주제 ${baseId}: ${pick(["내일 비 올까?", "코스피 상승?", "우승팀은?", "다음 주 유행은?"])}`,
    userId: "U001",
    optionA: "A",
    optionB: "B",
    optionC: index % 3 === 0 ? "C" : undefined,
    strDtm: start.toISOString(),
    endDtm: isEnded ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() : end.toISOString(),
    delYn: false,
    questionStatusCd: isEnded ? QuestionStatusCd.END : QuestionStatusCd.PROGRESS,
    participation: false,
    choiceType: "A",
    winner: isEnded ? pick(["A", "B", "C"]) : null,
    countA: Math.floor(Math.random() * 800),
    countB: Math.floor(Math.random() * 800),
    countC: Math.floor(Math.random() * 800),
    sumPointA: Math.floor(Math.random() * 100000),
    sumPointB: Math.floor(Math.random() * 100000),
    sumPointC: Math.floor(Math.random() * 100000),
    totalPoints: Math.floor(Math.random() * 300000),
    payoutA: 2.0,
    payoutB: 2.0,
    payoutC: 2.0,
    betPoint: 100,
    rewardPoint: 0,
    participationDtm: nowIso(),
    ...overrides,
  };
};

const paginate = <T,>(items: T[], page = 0, size = 18) => {
  const totalElements = items.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const start = page * size;
  const content = items.slice(start, start + size);
  const last = page >= totalPages - 1;
  return { content, totalElements, totalPages, size, number: page, last };
};

const getCurrentUser = (): MockUser | null => {
  const token = getAccessToken();
  if (!token) return null;
  return users[0] ?? null;
};

let users: MockUser[] = [
  {
    userId: "U001",
    email: "demo@balance.local",
    loginId: "demo",
    nickName: "Demo",
    password: "demo",
    totalPoint: 50000,
  },
];

let questions: IQuestionResult[] = Array.from({ length: 80 }).map((_, i) => makeQuestion(i));
let predicts: IPredictResult[] = Array.from({ length: 80 }).map((_, i) => makePredict(i));

const questionChoiceByUser: Record<string, Record<string, "A" | "B">> = {};
const predictChoiceByUser: Record<string, Record<string, "A" | "B" | "C">> = {};

const withUserQuestionFields = (q: IQuestionResult): IQuestionResult => {
  const user = getCurrentUser();
  if (!user) return q;
  const picked = questionChoiceByUser[user.userId]?.[q.questionId] ?? null;
  return {
    ...q,
    participation: !!picked,
    choiceType: picked,
  };
};

const withUserPredictFields = (p: IPredictResult): IPredictResult => {
  const user = getCurrentUser();
  if (!user) return p;
  const picked = predictChoiceByUser[user.userId]?.[p.predictId] ?? null;
  return {
    ...p,
    participation: !!picked,
    choiceType: (picked ?? p.choiceType) as any,
    betPoint: picked ? 100 : p.betPoint,
  };
};

const parseIdFromUrl = (prefix: string, url: string) => {
  const idx = url.indexOf(prefix);
  if (idx === -1) return null;
  const rest = url.slice(idx + prefix.length);
  const cleaned = rest.startsWith("/") ? rest.slice(1) : rest;
  return cleaned.split("/")[0] || null;
};

export const mockRequest = async <T>({ method, url, params, data }: MockRequest): Promise<AxiosResponse<IAPI_RESPONSE<T>>> => {
  // AUTH
  if (method === "POST" && url === "/auth/login") {
    const { loginIdOrEmail, password } = (data ?? {}) as { loginIdOrEmail?: string; password?: string };
    const user = users.find((u) => u.loginId === loginIdOrEmail || u.email === loginIdOrEmail) ?? users[0];
    if (!password || (user.password && password !== user.password)) {
      return Promise.reject(
        err("아이디 또는 비밀번호가 올바르지 않습니다.", 401, AUTH_ERROR.LOGIN_ERROR)
      ) as any;
    }
    return ok({
      userId: user.userId,
      email: user.email,
      loginId: user.loginId,
      nickName: user.nickName,
      accessToken: `mock-token-${Date.now()}`,
      totalPoint: user.totalPoint,
    } as any);
  }

  if (method === "POST" && url === "/auth/logout") {
    return ok(true as any);
  }

  if (method === "POST" && url === "/auth/republish") {
    return ok(`mock-token-${Date.now()}` as any);
  }

  if (method === "POST" && url.startsWith("/auth/idcheck/")) {
    const loginId = url.split("/").pop() ?? "";
    const exists = users.some((u) => u.loginId === loginId);
    if (exists) {
      return Promise.reject(
        err("이미 사용 중인 아이디입니다.", 409, SVC_ERROR.DUPLICATE_ID)
      ) as any;
    }
    return ok(true as any);
  }

  if (method === "POST" && url === "/auth/join") {
    const { loginId, email, nickName, password } = (data ?? {}) as any;
    if (!loginId || !email || !nickName || !password) {
      return Promise.reject(
        err("필수 입력값이 누락되었습니다.", 400, GENERAL_ERROR.BAD_REQUEST)
      ) as any;
    }
    if (users.some((u) => u.loginId === loginId)) {
      return Promise.reject(
        err("이미 사용 중인 아이디입니다.", 409, SVC_ERROR.DUPLICATE_ID)
      ) as any;
    }
    const newUser: MockUser = {
      userId: `U${String(users.length + 1).padStart(3, "0")}`,
      email,
      loginId,
      nickName,
      password,
      totalPoint: 10000,
    };
    users = [newUser, ...users];
    return ok({
      userId: newUser.userId,
      email: newUser.email,
      loginId: newUser.loginId,
      nickName: newUser.nickName,
      accessToken: `mock-token-${Date.now()}`,
      totalPoint: newUser.totalPoint,
    } as any);
  }

  // MAIL
  if (method === "POST" && url === "/mail/send/verify") {
    const expire = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    return ok(expire as any);
  }

  if (method === "POST" && url === "/mail/verify/check") {
    return ok(true as any);
  }

  // USER
  if (method === "GET" && url === "/user/totalPoint") {
    const user = getCurrentUser();
    return ok(((user?.totalPoint ?? 0) as any) as any);
  }

  if (method === "PUT" && url === "/user") {
    const user = getCurrentUser();
    if (!user)
      return Promise.reject(
        err("로그인이 필요합니다.", 401, AUTH_ERROR.SESSION_EXPIRED)
      ) as any;
    const next = { ...user, ...(data ?? {}) };
    users = [next, ...users.filter((u) => u.userId !== user.userId)];
    return ok(1 as any);
  }

  if (method === "PUT" && url === "/user/withdraw") {
    return ok(1 as any);
  }

  // PUBLIC - BALANCE
  if (method === "GET" && url === "/public/today") {
    const top = [...questions]
      .sort((a, b) => b.selectA + b.selectB - (a.selectA + a.selectB))
      .slice(0, 5)
      .map(withUserQuestionFields);
    return ok(top as any);
  }

  if (method === "GET" && url.startsWith("/public/rank/")) {
    const top3 = [...questions]
      .sort((a, b) => b.selectA + b.selectB - (a.selectA + a.selectB))
      .slice(0, 3)
      .map(withUserQuestionFields);
    return ok(top3 as any);
  }

  if (method === "GET" && url === "/public") {
    const p = (params ?? {}) as QuestionRequestType;
    const page = Number(p.page ?? 0);
    const pageSize = Number(p.pageSize ?? 18);
    const search = String(p.search ?? "").trim();
    const categories = String(p.categories ?? "")
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    const showEnded = Boolean(p.showEnded);
    const startDate = p.startDate ? new Date(String(p.startDate)) : null;
    const endDate = p.endDate ? new Date(String(p.endDate)) : null;

    let filtered = [...questions];

    if (!showEnded) {
      filtered = filtered.filter((q) => q.questionStatusCd !== QuestionStatusCd.END);
    }

    if (search.length >= 2) {
      filtered = filtered.filter((q) => q.title.includes(search) || (q.enTitle ?? "").toLowerCase().includes(search.toLowerCase()));
    }

    if (categories.length > 0) {
      filtered = filtered.filter((q) => categories.includes(q.categoryCd));
    }

    if (startDate) {
      filtered = filtered.filter((q) => new Date(q.strDate).getTime() >= startDate.getTime());
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((q) => new Date(q.endDate).getTime() <= end.getTime());
    }

    filtered = filtered.sort((a, b) => new Date(b.strDate).getTime() - new Date(a.strDate).getTime());
    const pageRes = paginate(filtered.map(withUserQuestionFields), page, pageSize);
    return ok(pageRes as any);
  }

  if (method === "GET" && url.startsWith("/public/") && !url.startsWith("/public/rank/")) {
    const questionId = parseIdFromUrl("/public", url);
    const q = questions.find((x) => x.questionId === questionId);
    if (!q) return Promise.reject(err("존재하지 않는 질문입니다.", 404, "NOT_FOUND")) as any;
    return ok(withUserQuestionFields(q) as any);
  }

  if (method === "PUT" && url === "/public/selection") {
    const { questionId, choiceType } = (data ?? {}) as { questionId: string; choiceType: "A" | "B" };
    const target = questions.find((q) => q.questionId === questionId);
    if (!target) return Promise.reject(err("존재하지 않는 질문입니다.", 404, "NOT_FOUND")) as any;
    const updated = {
      ...target,
      selectA: target.selectA + (choiceType === "A" ? 1 : 0),
      selectB: target.selectB + (choiceType === "B" ? 1 : 0),
    };
    questions = questions.map((q) => (q.questionId === questionId ? updated : q));
    return ok(true as any);
  }

  // SELECTION (logged-in balance selection)
  if (method === "POST" && url === "/selection") {
    const user = getCurrentUser();
    if (!user)
      return Promise.reject(
        err("로그인이 필요합니다.", 401, AUTH_ERROR.SESSION_EXPIRED)
      ) as any;
    const { questionId, choiceType, rewardPoint } = (data ?? {}) as { questionId: string; choiceType: "A" | "B"; rewardPoint?: number };
    const target = questions.find((q) => q.questionId === questionId);
    if (!target) return Promise.reject(err("존재하지 않는 질문입니다.", 404, "NOT_FOUND")) as any;

    questionChoiceByUser[user.userId] = questionChoiceByUser[user.userId] ?? {};
    questionChoiceByUser[user.userId][questionId] = choiceType;

    const updated = {
      ...target,
      selectA: target.selectA + (choiceType === "A" ? 1 : 0),
      selectB: target.selectB + (choiceType === "B" ? 1 : 0),
    };
    questions = questions.map((q) => (q.questionId === questionId ? updated : q));

    const gained = Number(rewardPoint ?? 0);
    users = users.map((u) => (u.userId === user.userId ? { ...u, totalPoint: u.totalPoint + gained } : u));

    return ok(true as any);
  }

  // PREDICT - PUBLIC LIST
  if (method === "GET" && url === "/public/predict") {
    const p = (params ?? {}) as PredictRequestType;
    const page = Number(p.page ?? 0);
    const pageSize = Number(p.pageSize ?? 18);
    const pageRes = paginate(predicts.map(withUserPredictFields), page, pageSize);
    return ok(pageRes as any);
  }

  // PREDICT - MY/participation lists & mutations
  if (method === "GET" && url === "/predict/my") {
    const pageRes = paginate(predicts.filter((x) => x.userId === "U001").map(withUserPredictFields), Number(params?.page ?? 0), Number(params?.pageSize ?? 18));
    return ok(pageRes as any);
  }

  if (method === "GET" && url === "/predict/participation") {
    const user = getCurrentUser();
    if (!user) return ok(paginate([] as any, 0, Number(params?.pageSize ?? 18)) as any);
    const participatedIds = new Set(Object.keys(predictChoiceByUser[user.userId] ?? {}));
    const pageRes = paginate(predicts.filter((x) => participatedIds.has(x.predictId)).map(withUserPredictFields), Number(params?.page ?? 0), Number(params?.pageSize ?? 18));
    return ok(pageRes as any);
  }

  if (method === "POST" && url === "/selection/betting") {
    const user = getCurrentUser();
    if (!user)
      return Promise.reject(
        err("로그인이 필요합니다.", 401, AUTH_ERROR.SESSION_EXPIRED)
      ) as any;
    const { predictId, choiceType, betPoint } = (data ?? {}) as { predictId: string; choiceType: "A" | "B" | "C"; betPoint?: number };
    const target = predicts.find((p) => p.predictId === predictId);
    if (!target) return Promise.reject(err("존재하지 않는 예측입니다.", 404, "NOT_FOUND")) as any;

    predictChoiceByUser[user.userId] = predictChoiceByUser[user.userId] ?? {};
    predictChoiceByUser[user.userId][predictId] = choiceType;

    const next: IPredictResult = {
      ...target,
      countA: target.countA + (choiceType === "A" ? 1 : 0),
      countB: target.countB + (choiceType === "B" ? 1 : 0),
      countC: target.countC + (choiceType === "C" ? 1 : 0),
      participation: true,
      betPoint: Number(betPoint ?? 100),
    };
    predicts = predicts.map((p) => (p.predictId === predictId ? next : p));
    return ok(true as any);
  }

  if (method === "POST" && url === "/predict") {
    const payload = (data ?? {}) as PredictCreateType;
    const id = `PRD${Date.now()}`;
    const created: IPredictResult = makePredict(0, {
      predictId: id,
      title: payload.title,
      optionA: payload.optionA,
      optionB: payload.optionB,
      optionC: payload.optionC,
      questionStatusCd: payload.questionStatusCd as any,
      strDtm: payload.strDtm ?? nowIso(),
      endDtm: payload.endDtm ?? nowIso(),
    });
    predicts = [created, ...predicts];
    return ok(created as any);
  }

  if (method === "PUT" && url === "/predict") {
    const payload = (data ?? {}) as PredictCreateType;
    if (!payload.predictId)
      return Promise.reject(
        err("predictId가 필요합니다.", 400, GENERAL_ERROR.BAD_REQUEST)
      ) as any;
    predicts = predicts.map((p) => (p.predictId === payload.predictId ? { ...p, title: payload.title, optionA: payload.optionA, optionB: payload.optionB, optionC: payload.optionC, questionStatusCd: payload.questionStatusCd as any } : p));
    return ok(1 as any);
  }

  if (method === "DELETE" && url.startsWith("/predict/participation/")) {
    const predictId = url.split("/").pop() ?? "";
    const user = getCurrentUser();
    if (user && predictChoiceByUser[user.userId]) {
      delete predictChoiceByUser[user.userId][predictId];
    }
    return ok(1 as any);
  }

  if (method === "DELETE" && url.startsWith("/predict/")) {
    const predictId = url.split("/").pop() ?? "";
    predicts = predicts.filter((p) => p.predictId !== predictId);
    return ok(1 as any);
  }

  if (method === "PUT" && url === "/predict/result") {
    const { predictId, winner } = (data ?? {}) as { predictId: string; winner: "A" | "B" | "C" };
    predicts = predicts.map((p) => (p.predictId === predictId ? { ...p, winner, questionStatusCd: QuestionStatusCd.END } : p));
    return ok(1 as any);
  }

  // QUESTION - MY/participation lists & mutations
  if (method === "GET" && url === "/question/my") {
    const pageRes = paginate(questions.filter((x) => x.userId === "U001").map(withUserQuestionFields), Number(params?.page ?? 0), Number(params?.pageSize ?? 18));
    return ok(pageRes as any);
  }

  if (method === "GET" && url === "/question/participation") {
    const user = getCurrentUser();
    if (!user) return ok(paginate([] as any, 0, Number(params?.pageSize ?? 18)) as any);
    const participatedIds = new Set(Object.keys(questionChoiceByUser[user.userId] ?? {}));
    const pageRes = paginate(questions.filter((x) => participatedIds.has(x.questionId)).map(withUserQuestionFields), Number(params?.page ?? 0), Number(params?.pageSize ?? 18));
    return ok(pageRes as any);
  }

  if (method === "POST" && url === "/question") {
    const payload = (data ?? {}) as QuestionCreateType;
    const id = `QST${Date.now()}`;
    const created: IQuestionResult = makeQuestion(0, {
      questionId: id,
      title: payload.title,
      choiceA: payload.choiceA,
      choiceB: payload.choiceB,
      categoryCd: payload.categoryCd ?? CategoryValue.DAILY,
      questionStatusCd: payload.questionStatusCd as any,
      strDate: payload.strDate ?? nowIso(),
      endDate: payload.endDate ?? nowIso(),
      point: payload.point ?? 0,
    });
    questions = [created, ...questions];
    return ok(created as any);
  }

  if (method === "PUT" && url === "/question") {
    const payload = (data ?? {}) as QuestionCreateType;
    if (!payload.questionId)
      return Promise.reject(
        err("questionId가 필요합니다.", 400, GENERAL_ERROR.BAD_REQUEST)
      ) as any;
    questions = questions.map((q) =>
      q.questionId === payload.questionId
        ? {
            ...q,
            title: payload.title,
            choiceA: payload.choiceA,
            choiceB: payload.choiceB,
            categoryCd: payload.categoryCd ?? q.categoryCd,
            questionStatusCd: payload.questionStatusCd as any,
            point: payload.point ?? q.point,
          }
        : q
    );
    return ok(1 as any);
  }

  if (method === "DELETE" && url.startsWith("/question/")) {
    const questionId = url.split("/").pop() ?? "";
    questions = questions.filter((q) => q.questionId !== questionId);
    return ok(1 as any);
  }

  return Promise.reject(
    err(`Mock handler not found: ${method} ${url}`, 404, SVC_ERROR.NO_DATA)
  ) as any;
};
