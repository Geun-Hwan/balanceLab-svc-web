type GeneralErrorType = {
  INTERNAL_SERVER_ERROR: string; // 서버 내부 오류
  BAD_REQUEST: string; // 잘못된 API 요청
  METHOD_NOT_ALLOWED: string; // 허용되지 않은 HTTP 메서드
};

type AuthErrorType = {
  ACCESS_TOKEN_EXPIRED: string;
  SESSION_EXPIRED: string;
  LOGIN_ERROR: string;
  PASSWORD_ERROR: string;
};

// SVC_ERROR 타입 정의
type SvcErrorType = {
  NO_DATA: string;
  EMAIL_ALREADY_REGISTERED: string;
  EMAIL_NOT_FOUND: string;
  EMAIL_SEND_FAILED: string;
  INVALID_VERIFICATION_CODE: string;
  DUPLICATE_ID: string;
  EXPIRE_VERIFICATION_CODE: string;
};

type UserStatusErrorType = {
  BANNED: string; // 차단된 사용자
  DORMANT: string; // 휴면 상태 사용자
  TERMINATED: string; // 탈퇴 처리 중 사용자
};

type ErrorType = AuthErrorType &
  SvcErrorType &
  UserStatusErrorType &
  GeneralErrorType;

export const GENERAL_ERROR: GeneralErrorType = {
  INTERNAL_SERVER_ERROR: "ERR001", // 서버 내부 오류
  BAD_REQUEST: "ERR002", // 잘못된 API 요청
  METHOD_NOT_ALLOWED: "ERR003", // 허용되지 않은 HTTP 메서드
};

export const AUTH_ERROR: AuthErrorType = {
  ACCESS_TOKEN_EXPIRED: "AUTH_ERROR1",
  SESSION_EXPIRED: "AUTH_ERROR2",
  LOGIN_ERROR: "AUTH_ERROR3",
  PASSWORD_ERROR: "AUTH_ERROR4",
};

export const SVC_ERROR: SvcErrorType = {
  NO_DATA: "SVC_ERROR1",
  EMAIL_ALREADY_REGISTERED: "SVC_ERROR2",
  EMAIL_NOT_FOUND: "SVC_ERROR3",
  EMAIL_SEND_FAILED: "SVC_ERROR4",
  INVALID_VERIFICATION_CODE: "SVC_ERROR5",
  DUPLICATE_ID: "SVC_ERROR6",
  EXPIRE_VERIFICATION_CODE: "SVC_ERROR7",
};
export const USER_STATUS_ERROR: UserStatusErrorType = {
  BANNED: "USER_STATUS_ERROR1", // 차단된 사용자
  DORMANT: "USER_STATUS_ERROR2", // 휴면 상태 사용자
  TERMINATED: "USER_STATUS_ERROR3", // 탈퇴 처리 중
};

export const ALL_ERRORS: ErrorType = Object.assign(
  {},
  GENERAL_ERROR,
  AUTH_ERROR,
  SVC_ERROR,
  USER_STATUS_ERROR
);
