import { login, LoginRequestType } from "@/api/authApi";
import Content from "@/layout/Content";
import { useAlertStore, useUserStore } from "@/store/store";
import { handleLoginSuccess } from "@/utils/loginUtil";
import {
  Anchor,
  Button,
  Checkbox,
  Flex,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { Form, useNavigate } from "react-router-dom";

const LoginTemplate = () => {
  const { showAlert, alertVisible } = useAlertStore();
  const { isLogin, setIdSaveCheck, idSaveCheck, rememberId, setRememberId } =
    useUserStore();
  const navigate = useNavigate();
  const [loginState, setLoginState] = useState<LoginRequestType>({
    loginIdOrEmail: idSaveCheck && rememberId ? rememberId : "",
    password: "",
  });

  const { mutate: loginMutate, isPending } = useMutation({
    mutationFn: (params: LoginRequestType) => login(params),
    onSuccess: (data) => {
      handleLoginSuccess(data, () => navigate("/", { replace: true }));
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
    if (alertVisible) {
      return;
    }
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

    if (idSaveCheck) {
      if (!rememberId) {
        setIdSaveCheck(false);
      }
    }
  }, []);

  const handleCheckId = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget;

    setIdSaveCheck(checked);

    if (checked) {
      setRememberId(loginState.loginIdOrEmail);
    }
  };

  return (
    <Content headerProps={{ name: "Login" }}>
      <Paper
        p="lg"
        radius="md"
        shadow="md"
        w={"100%"}
        maw={"600"}
        withBorder
        mx="auto"
        mih={350}
        mt={"xl"}
        display={"flex"}
        style={{ flexDirection: "column", position: "relative" }}
      >
        <Title ta={"center"} order={2}>
          로그인
        </Title>
        <Form>
          <TextInput
            name="loginIdOrEmail"
            label="아이디 또는 이메일"
            placeholder="example@email.com"
            value={loginState.loginIdOrEmail}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === " ") e.preventDefault();

              if (e.key === "Enter") handleLogin(e);
            }} // 스페이스바 입력 차단
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
        </Form>

        <Stack justify="flex-end" flex={1}>
          <Flex gap={"sm"}>
            <Checkbox checked={idSaveCheck} onChange={handleCheckId} />
            아이디 저장
          </Flex>
          <Button fullWidth onClick={handleLogin} loading={isPending}>
            로그인
          </Button>
          <Flex justify="center" align="center" mt="sm">
            <Anchor
              size="sm"
              fw={600}
              ml="xs"
              onClick={() => navigate("/join")}
            >
              회원가입
            </Anchor>
            <Text size="sm" c="dimmed" mx="xs">
              │
            </Text>
            <Anchor size="sm" fw={600} onClick={undefined}>
              비밀번호 찾기
            </Anchor>
          </Flex>
        </Stack>
      </Paper>
    </Content>
  );
};

export default LoginTemplate;
