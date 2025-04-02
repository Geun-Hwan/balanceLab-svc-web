import { idDuplicationCheck, join, JoinRequest } from "@api/authApi";
import { verifyCheck, verifyMailSend } from "@api/mailApi";
import Content from "@/layout/Content";
import { useAlertStore } from "@/store/store";
import { handleLoginSuccess } from "@/utils/loginUtil";
import {
  Button,
  Flex,
  Loader,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { Form } from "react-router-dom";

const JointTemplate = () => {
  const { showAlert } = useAlertStore();
  const { mutate: idCheckMutate, isPending: idPending } = useMutation({
    mutationFn: (params: string) => idDuplicationCheck(params),
    onSuccess: () => {
      setFieldChecked((prev) => ({ ...prev, loginId: true }));
      setSuccessMessage((prev) => ({
        ...prev,
        loginId: "사용 가능한 아이디입니다.",
      }));
      setFieldChecked((prev) => {
        return { ...prev, loginId: true };
      });
    },
    onError: (res: AxiosResponse) => {
      if (res?.data) {
        setErrorMessage((prev) => ({
          ...prev,
          loginId: res?.data?.message,
        }));
      }
    },
  });

  const { mutate: verifyMailSendMutate, isPending: sendPending } = useMutation({
    mutationFn: (params: { email: string }) => verifyMailSend(params),
    onSuccess: (data) => {
      if (data) {
        setEmailSent(true);

        setExpireTime(new Date(data));

        setFieldChecked((prev) => ({ ...prev, email: true }));
        setSuccessMessage((prev) => ({
          ...prev,
          email: "이메일로 인증번호를 발송했습니다.",
        }));
      }
    },
    onError: (res: AxiosResponse) => {
      if (res?.data) {
        setErrorMessage((prev) => ({
          ...prev,
          email: res?.data?.message,
        }));
      }
    },
  });

  const { mutate: verifCheckMutate, isPending: checkPending } = useMutation({
    mutationFn: (params: { email: string; verifyCode: string }) =>
      verifyCheck(params),

    onSuccess: (data) => {
      if (data) {
        console.log(data);
        setSuccessMessage((prev) => ({
          ...prev,
          emailCode: "인증이 완료되었습니다.",
        }));
        setFieldChecked((prev) => ({
          ...prev,
          emailCode: true,
        }));

        setExpireTime(null);
        setEmailSent(false);
      }
    },
    onError: (res: AxiosResponse) => {
      if (res?.data) {
        setErrorMessage((prev) => ({
          ...prev,
          emailCode: res?.data?.message,
        }));
      }
    },
  });

  const { mutate: joinMutate, isPending: joinPending } = useMutation({
    mutationFn: (params: JoinRequest) => join(params),

    onSuccess: (data) => {
      handleLoginSuccess(data);
      showAlert("가입이 완료되었습니다.", "success");
    },
    onError: (res: AxiosResponse) => {
      showAlert(res?.data?.message, "error");
    },
  });

  const [form, setForm] = useState({
    loginId: "",
    password: "",
    confirmPassword: "",
    email: "",
    emailCode: "",
    nickName: "",
  });

  const [errorMessage, setErrorMessage] = useState({
    loginId: "",
    password: "",
    confirmPassword: "",
    email: "",
    emailCode: "",
    nickName: "",
  });
  const [successMessage, setSuccessMessage] = useState({
    loginId: "",
    password: "",
    confirmPassword: "",
    email: "",
    emailCode: "",
    nickName: "",
  });
  const [fieldChecked, setFieldChecked] = useState({
    loginId: false,
    password: false,
    confirmPassword: false,
    email: false,
    emailCode: false,
    nickName: false,
  });

  const [emailSent, setEmailSent] = useState(false);
  const [expireTime, setExpireTime] = useState<null | Date>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrorMessage((prev) => ({
      ...prev,
      [name]: "",
      ...(name === "password" && { confirmPassword: "" }), // ✅ 에러 메시지도 초기화
      ...(name === "email" && { emailCode: "" }),
    }));
    setSuccessMessage((prev) => ({
      ...prev,
      [name]: "",
      ...(name === "password" && { confirmPassword: "" }), // ✅ 성공 메시지도 초기화
    }));
    setFieldChecked((prev) => ({
      ...prev,
      [name]: false,
      ...(name === "password" && { confirmPassword: false }), // ✅ 체크 여부도 초기화
    }));

    if (name === "password") {
      check.password(value);
    }
    if (name === "confirmPassword") {
      check.confirmPassword(value);
    }
    if (name === "nickName") {
      check.nickName(value);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const allFieldsChecked = Object.values(fieldChecked).every(
      (value) => value === true
    );

    if (allFieldsChecked && !joinPending) {
      joinMutate(form);
    } else {
      showAlert("모든 항목을 올바르게 입력해주세요.", "warning");
    }
    // 회원가입 API 호출
  };

  const check = {
    loginId: async () => {
      const idRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
      if (!idRegex.test(form.loginId)) {
        setErrorMessage((prev) => {
          return {
            ...prev,
            loginId: "아이디 형식이 올바르지 않습니다.",
          };
        });
        return;
      }

      if (!idPending) {
        idCheckMutate(form.loginId);
      }
    },
    password: (password: string) => {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{10,30}$/;

      if (!password.length) {
        setErrorMessage((prev) => {
          return {
            ...prev,
            password: "",
          };
        });
        return;
      }
      if (!passwordRegex.test(password)) {
        setErrorMessage((prev) => {
          return {
            ...prev,
            password: "비밀번호 형식이 올바르지 않습니다.",
          };
        });
        return;
      }

      setSuccessMessage((prev) => {
        return {
          ...prev,
          password: "사용 가능한 비밀번호입니다",
        };
      });
      setFieldChecked((prev) => {
        return { ...prev, password: true };
      });
    },
    confirmPassword: (confirmPassword: string) => {
      if (confirmPassword.length === 0) {
        setErrorMessage((prev) => {
          return {
            ...prev,
            confirmPassword: "",
          };
        });
        return;
      }

      if (form.password !== confirmPassword) {
        setErrorMessage((prev) => ({
          ...prev,
          confirmPassword: "비밀번호가 일치하지 않습니다.",
        }));
        return;
      }

      setSuccessMessage((prev) => ({
        ...prev,
        confirmPassword: "비밀번호가 일치합니다.",
      }));
      setFieldChecked((prev) => ({
        ...prev,
        confirmPassword: true,
      }));
    },
    email: () => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(form.email)) {
        setErrorMessage((prev) => ({
          ...prev,
          email: "올바른 이메일을 입력해주세요.",
        }));
        return;
      }
      // ✅ API 호출하여 이메일 인증번호 발송 (예시)

      if (!sendPending) {
        setErrorMessage((prev) => ({
          ...prev,
          email: "",
          emailCode: "",
        }));

        verifyMailSendMutate({ email: form.email });
      }
    },
    emailCode: () => {
      if (form.emailCode.length !== 6) {
        setErrorMessage((prev) => ({
          ...prev,
          emailCode: "인증 번호 6자리를 입력해주세요.",
        }));
        return;
      }

      if (!checkPending) {
        verifCheckMutate({ email: form.email, verifyCode: form.emailCode });
      }
    },
    nickName: (nickName: string) => {
      if (!nickName.length) {
        setErrorMessage((prev) => {
          return {
            ...prev,
            nickName: "",
          };
        });
        return;
      }

      const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,10}$/;
      if (!nicknameRegex.test(nickName)) {
        setErrorMessage((prev) => {
          return {
            ...prev,
            nickName: "닉네임 형식이 올바르지 않습니다.",
          };
        });
        return;
      }

      setSuccessMessage((prev) => {
        return {
          ...prev,
          nickName: "사용 가능한 닉네임입니다.",
        };
      });
      setFieldChecked((prev) => {
        return { ...prev, nickName: true };
      });
    },
  };

  // 이메일 인증번호 확인

  const resetEmailCode = () => {
    setExpireTime(null);
    setEmailSent(false);
    setFieldChecked((prev) => ({ ...prev, email: false }));
    setSuccessMessage((prev) => ({ ...prev, email: "" }));
    setErrorMessage((prev) => ({
      ...prev,
      emailCode: "시간이 만료되었습니다.",
    }));
  };

  useEffect(() => {
    if (expireTime && !fieldChecked.emailCode && fieldChecked.email) {
      const timer = setInterval(() => {
        const currentTime = new Date();
        const remainingTime = Math.max(
          0,
          Math.floor((expireTime.getTime() - currentTime.getTime()) / 1000)
        );

        setTimeLeft(remainingTime);
        if (remainingTime <= 600) {
          setEmailSent(false);
        }

        if (remainingTime === 0) {
          clearInterval(timer); // 타이머 종료
          resetEmailCode();
        }
      }, 1000);

      // 컴포넌트가 unmount 될 때 타이머 정리
      return () => clearInterval(timer);
    }
  }, [expireTime, fieldChecked.email, fieldChecked.emailCode]);

  return (
    <Content headerProps={{ name: "Join" }}>
      <Paper
        p="lg"
        radius="md"
        shadow="md"
        maw={"600"}
        mx="auto"
        withBorder
        w={"100%"}
        my={"xl"}
        style={{ flexDirection: "column" }}
      >
        <Title order={2} ta="center" mb="md">
          회원가입
        </Title>

        <Form>
          <TextInput
            descriptionProps={{
              style: {
                color: successMessage.loginId ? "#12B886" : undefined,
              }, // ✅ 스타일 적용
            }}
            description={
              successMessage.loginId
                ? successMessage.loginId
                : !errorMessage.loginId
                ? "영문, 숫자를 포함하여 8~16자로 입력하세요."
                : ""
            }
            maxLength={16}
            inputWrapperOrder={["label", "input", "description", "error"]}
            onKeyDown={(e) => e.key === " " && e.preventDefault()}
            label="아이디"
            name="loginId"
            value={form.loginId}
            onChange={handleChange}
            placeholder="아이디 입력"
            rightSectionWidth={80} // 버튼 공간 확보
            error={errorMessage.loginId}
            rightSection={
              <Button
                size="xs"
                onClick={check.loginId}
                disabled={fieldChecked.loginId || !!errorMessage.loginId}
                variant="default"
                loading={idPending}
                py={0}
              >
                중복 확인
              </Button>
            }
            required
          />

          <PasswordInput
            descriptionProps={{
              style: {
                color: successMessage.password ? "#12B886" : undefined,
              },
            }}
            maxLength={30}
            description={
              successMessage.password
                ? successMessage.password
                : !errorMessage.password
                ? "영문, 숫자, 특수문자를 포함하여 10~30자로 입력하세요."
                : ""
            }
            inputWrapperOrder={["label", "input", "description", "error"]}
            label="비밀번호"
            visibilityToggleButtonProps={{ display: "none" }}
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errorMessage.password}
            placeholder="비밀번호 입력"
            onKeyDown={(e) => e.key === " " && e.preventDefault()}
            mt="xs"
            required
          />
          <PasswordInput
            label="비밀번호 확인"
            descriptionProps={{
              style: {
                color: successMessage.confirmPassword ? "#12B886" : undefined,
              },
            }}
            description={
              successMessage.confirmPassword
                ? successMessage.confirmPassword
                : !errorMessage.confirmPassword
                ? "\u00A0"
                : ""
            }
            inputWrapperOrder={["label", "input", "description", "error"]}
            name="confirmPassword"
            error={errorMessage.confirmPassword}
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="비밀번호 확인"
            onKeyDown={(e) => e.key === " " && e.preventDefault()}
            mt="xs"
            required
          />
          <TextInput
            descriptionProps={{
              style: {
                color: successMessage.email ? "#12B886" : undefined,
              },
            }}
            description={
              successMessage.email
                ? successMessage.email
                : !errorMessage.email
                ? "\u00A0"
                : ""
            }
            onKeyDown={(e) => e.key === " " && e.preventDefault()}
            inputWrapperOrder={["label", "input", "description", "error"]}
            label="이메일"
            name="email"
            type="email"
            disabled={
              fieldChecked.email || fieldChecked.emailCode || sendPending
            }
            value={form.email}
            onChange={handleChange}
            placeholder="이메일 입력"
            mt="xs"
            error={errorMessage.email}
            rightSectionWidth={70}
            required
            rightSection={
              <Button
                size="xs"
                onClick={check.email}
                disabled={
                  emailSent ||
                  fieldChecked.emailCode ||
                  sendPending ||
                  !!errorMessage.email
                }
                miw={65}
                variant="default"
                style={{
                  fontSize: 10,
                  padding: 0, // 내부 여백 최소화
                  width: "auto", // 텍스트 길이에 맞게 자동 조절
                }}
                loading={sendPending}
              >
                {sendPending ? (
                  <Loader
                    size="xs"
                    style={{ alignSelf: "center", justifyContent: "center" }}
                    flex={1}
                    display={"flex"}
                  />
                ) : fieldChecked.emailCode ? (
                  "인증완료"
                ) : expireTime ? (
                  "재전송"
                ) : (
                  "인증번호 전송"
                )}
              </Button>
            }
          />

          {
            <Flex align="flex-start" mt="xs">
              <TextInput
                flex={1}
                type="number"
                maxLength={6}
                disabled={!fieldChecked.email || fieldChecked.emailCode}
                inputWrapperOrder={["label", "input", "description", "error"]}
                descriptionProps={{
                  style: {
                    color: successMessage.emailCode ? "#12B886" : undefined,
                  },
                }}
                description={
                  successMessage.emailCode
                    ? successMessage.emailCode
                    : !errorMessage.emailCode
                    ? "\u00A0"
                    : ""
                }
                name="emailCode"
                value={form.emailCode}
                error={errorMessage.emailCode}
                onChange={handleChange}
                placeholder="인증번호 입력"
                required
                onKeyDown={(e) => e.key === " " && e.preventDefault()}
                rightSectionWidth={60}
                rightSection={
                  timeLeft > 0 && !fieldChecked.emailCode ? (
                    <Text size="sm">
                      {`${Math.floor(timeLeft / 60)}:${String(
                        timeLeft % 60
                      ).padStart(2, "0")}`}
                    </Text>
                  ) : (
                    <Text size="sm">00:00</Text> // 공백 유지
                  )
                }
              />

              <Button
                variant="default"
                size="sm"
                onClick={check.emailCode}
                disabled={fieldChecked.emailCode || !fieldChecked.email}
                loading={checkPending}
              >
                확인
              </Button>
            </Flex>
          }
          <TextInput
            inputWrapperOrder={["label", "input", "description", "error"]}
            descriptionProps={{
              style: {
                color: successMessage.nickName ? "#12B886" : undefined,
              },
            }}
            maxLength={8}
            description={
              successMessage.nickName
                ? successMessage.nickName
                : !errorMessage.nickName
                ? "닉네임은 2~10자, 한글, 영어, 숫자만 입력하세요."
                : ""
            }
            error={errorMessage.nickName}
            label="닉네임"
            onKeyDown={(e) => e.key === " " && e.preventDefault()}
            name="nickName"
            value={form.nickName}
            onChange={handleChange}
            placeholder="닉네임 입력"
            mt="xs"
            required
          />
        </Form>
        <Button
          onClick={handleSubmit}
          fullWidth
          mt="xl"
          variant="filled"
          loading={joinPending}
        >
          가입하기
        </Button>
      </Paper>
    </Content>
  );
};

export default JointTemplate;
