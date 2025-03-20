import { login, LoginRequestType } from "@/api/authApi";
import { useAlertStore, useUserStore } from "@/store/store";
import { handleLoginSuccess } from "@/utils/loginUtil";
import {
  Anchor,
  Button,
  Flex,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { Form, useNavigate } from "react-router-dom";

const LoginTemplate = () => {
  const { showAlert } = useAlertStore();
  const { isLogin } = useUserStore();
  const navigate = useNavigate();
  const [loginState, setLoginState] = useState<LoginRequestType>({
    loginIdOrEmail: "",
    password: "",
  });

  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: (params: LoginRequestType) => login(params),
    onSuccess: (data, variables, context) => {
      handleLoginSuccess(data);
    },
    onError: (res: AxiosResponse) => {
      if (res?.data?.code) {
        showAlert(res.data?.message, "error");
      }
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLoginState((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (!isPending) {
      if (loginState.loginIdOrEmail && loginState.password) {
        loginMutate(loginState);
      }
    }
  };
  useEffect(() => {
    if (isLogin) {
      navigate("/", { replace: true });
    }
  }, [isLogin, navigate]);

  return (
    <Flex justify="center" h="70dvh">
      <Paper
        p="lg"
        radius="md"
        shadow="md"
        flex={1}
        maw={"400"}
        withBorder
        m="auto"
      >
        <Title ta={"center"} order={2} mb="md">
          로그인
        </Title>
        <Form>
          <TextInput
            name="loginIdOrEmail"
            label="아이디 또는 이메일"
            placeholder="example@email.com"
            value={loginState.loginIdOrEmail}
            onChange={handleChange}
            onKeyDown={(e) => e.key === " " && e.preventDefault()} // 스페이스바 입력 차단
            required
          />
          <PasswordInput
            name="password"
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
            value={loginState.password}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === " ") e.preventDefault();

              if (e.key === "Enter") handleLogin(e);
            }}
            required
          />

          <Flex justify="center" align="center" mt="sm">
            <Text size="sm" c="dimmed">
              계정이 없으신가요?
            </Text>
            <Anchor
              size="sm"
              fw={600}
              ml="xs"
              onClick={() => navigate("/join")}
              style={{ cursor: "pointer" }}
            >
              회원가입
            </Anchor>
          </Flex>

          <Button fullWidth mt="md" onClick={handleLogin}>
            로그인
          </Button>
        </Form>
      </Paper>
    </Flex>
  );
};

export default LoginTemplate;
