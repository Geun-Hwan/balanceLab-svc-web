import { ILoginResult, logout } from "@/api/authApi";
import { modifyUser, UserModifyType, withdrawUser } from "@/api/userApi";
import { ALL_ERRORS, AUTH_ERROR } from "@/constants/ErrorConstants";
import Content from "@/layout/Content";
import { useAlertStore, useUserStore } from "@/store/store";
import { handleLoginSuccess, handleLogoutCallback } from "@/utils/loginUtil";
import {
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Group,
  PasswordInput,
  Space,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconBell,
  IconHistory,
  IconLock,
  IconLogout,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

const MypageTemplate = () => {
  const { userData } = useUserStore();
  const { showAlert } = useAlertStore();
  const { mutate: modifyNickName, isPending: nickNamePending } = useMutation({
    mutationFn: (params: UserModifyType) => modifyUser(params),
    onMutate: (_variables) => {},
    onSuccess: (data) => {
      if (data > 0) {
        const copy = { ...userData } as ILoginResult;
        copy.nickName = formData.changeNickName;
        handleLoginSuccess(copy, () => {
          showAlert("닉네임 변경이 완료되었습니다.");
        });
      }
    },
    onError: (_error, _variables, _context) => {
      // 에러가 발생하면, 이전 상태로 되돌립니다.
    },
  });

  const { mutate: modifyPassword, isPending: passwordPending } = useMutation({
    mutationFn: (params: UserModifyType) => modifyUser(params),
    onMutate: (_variables) => {},
    onSuccess: (data) => {
      if (data > 0) {
        showAlert("비밀번호 변경이 완료되었습니다.");
      }
    },
    onError: (res: any, _variables, _context) => {
      if (Object.values(ALL_ERRORS).includes(res?.data?.code)) {
        showAlert(res?.data.message, "error");
      }
    },
  });

  const { nickName, email } = userData as ILoginResult;
  const [formData, setFormData] = useState({
    changeNickName: nickName,
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{10,30}$/;
  const nicknameRegex = /^[a-zA-Z0-9가-힣]{2,10}$/;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateeNickname = () => {
    if (!nicknameRegex.test(formData.changeNickName)) {
      return;
    }
    if (nickName === formData.changeNickName) {
      return;
    }

    modifyNickName({ nickName: formData.changeNickName });
  };

  const handleUpdatePassword = () => {
    // formData.password
    const { confirmPassword, password, newPassword } = formData;

    if (!password) {
      showAlert("현재 비밀번호를 입력해주세요.", "warning");
      return;
    }

    if (!newPassword) {
      showAlert("새 비밀번호를 입력해주세요.", "warning");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      showAlert("새 비밀번호 형식이 올바르지 않습니다.", "warning");
      return;
    }

    if (!confirmPassword) {
      showAlert("새 비밀번호 확인을 입력해주세요.", "warning");
      return;
    }

    if (newPassword !== confirmPassword) {
      showAlert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.", "warning");
      return;
    }

    if (password === newPassword) {
      showAlert(
        "현재 비밀번호와 새 비밀번호는 다르게 설정해야 합니다.",
        "warning"
      );
      return;
    }
    modifyPassword({ password, newPassword });
  };

  return (
    <Content headerProps={{ name: "MyPage" }}>
      <Stack gap="xl" mt={"lg"} maw={600} mx={"auto"}>
        {/* 프로필 섹션 */}
        <Card withBorder shadow="sm" radius="md" p="md">
          <Group justify="space-between" align="flex-start">
            <Group>
              <Avatar size="xl" radius="xl" color="blue">
                {nickName.slice(0, 2)}
              </Avatar>
              <Box>
                <Title order={4}>{nickName}</Title>
                <Text c="dimmed" size="sm">
                  {email}
                </Text>
              </Box>
            </Group>
            <Button variant="light">프로필 변경</Button>
          </Group>
        </Card>

        {/* 계정 정보 섹션 */}
        <Card withBorder shadow="sm" radius="md" p="md">
          <Title order={5} mb="md">
            계정 정보
          </Title>
          <Divider mb="md" />

          <Stack gap="md">
            {/* 닉네임 변경 */}
            <Box>
              <Group mb="xs" justify="space-between">
                <Group gap="xs">
                  <IconUser size={18} />
                  <Text fw={500}>닉네임 변경</Text>
                </Group>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                닉네임은 2~10자의 한글, 영어, 숫자만 입력할 수 있습니다.
              </Text>
              <Group gap="md">
                <TextInput
                  flex={1}
                  name="changeNickName"
                  placeholder="새 닉네임"
                  value={formData.changeNickName}
                  onChange={handleChange}
                />
                <Button
                  variant="light"
                  onClick={handleUpdateeNickname}
                  loading={nickNamePending}
                >
                  변경하기
                </Button>
              </Group>
            </Box>

            {/* 비밀번호 변경 */}
            <Box>
              <Group mb="xs" justify="space-between">
                <Group gap="xs">
                  <IconLock size={18} />
                  <Text fw={500}>비밀번호 변경</Text>
                </Group>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                비밀번호는 10~30자의 영문, 숫자, 특수문자를 포함해야 합니다.
              </Text>
              <Stack gap="xs">
                <PasswordInput
                  value={formData.password}
                  placeholder="현재 비밀번호"
                  onChange={handleChange}
                  name="password"
                />
                <PasswordInput
                  value={formData.newPassword}
                  placeholder="새 비밀번호"
                  onChange={handleChange}
                  name="newPassword"
                />
                <PasswordInput
                  value={formData.confirmPassword}
                  placeholder="새 비밀번호 확인"
                  onChange={handleChange}
                  name="confirmPassword"
                />
                <Button
                  variant="light"
                  onClick={handleUpdatePassword}
                  loading={passwordPending}
                >
                  비밀번호 변경
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Card>

        {/* 알림 설정 */}
        <Card withBorder shadow="sm" radius="md" p="md">
          <Title order={5} mb="md">
            알림 설정
          </Title>
          <Divider mb="md" />

          <Stack gap="md">
            <Group justify="space-between">
              <Group gap="xs">
                <IconMail size={18} />
                <Text>마케팅 이메일 수신</Text>
              </Group>
              <Switch
                checked={true}
                readOnly

                // onChange={(e) => setMarketingConsent(e.currentTarget.checked)}
              />
            </Group>

            <Group justify="space-between">
              <Group gap="xs">
                <IconBell size={18} />
                <Text>서비스 알림 수신</Text>
              </Group>
              <Switch checked={true} readOnly />
            </Group>
          </Stack>
        </Card>

        {/* 추가 섹션 */}
        <Card withBorder shadow="sm" radius="md" p="md">
          <Title order={5} mb="md">
            기타
          </Title>
          <Divider mb="md" />

          <Stack gap="md">
            <Group justify="space-between">
              <Group gap="xs">
                <IconLogout size={18} color="red" />
                <Text c="red">계정 탈퇴</Text>
              </Group>
              <WithdrawConfirmModal />
            </Group>
          </Stack>
        </Card>

        <Space h="xl" />
      </Stack>
    </Content>
  );
};

const WithdrawConfirmModal = () => {
  const { showAlert } = useAlertStore();

  const qc = useQueryClient();
  const navigate = useNavigate();
  const { mutate: withdraw, isPending } = useMutation({
    mutationFn: withdrawUser,
    onMutate: (_variables) => {},
    onSuccess: (data) => {
      if (data > 0) {
        showAlert("탈퇴 처리되었습니다.");
        logoutMutate();
      }
    },
    onError: (res: any, _variables, _context) => {
      if (Object.values(ALL_ERRORS).includes(res?.data?.code)) {
        // 에러 코드가 포함되어 있으면
        showAlert(res?.data.message, "error");
      } else {
        // 에러 코드가 포함되지 않으면 다른 처리
        showAlert("알 수 없는 오류가 발생했습니다.", "error");
      }
    },
  });

  const { mutate: logoutMutate } = useMutation({
    mutationFn: () => logout(),
    onSuccess: (_data, _variables, _context) => {
      handleLogoutCallback(() => {
        navigate("/");
        qc.clear();
      });
    },
    onError: () => {
      handleLogoutCallback(() => {
        navigate("/");
        qc.clear();
      });
    },
  });

  const handleClick = () => {
    modals.openConfirmModal({
      title: "회원 탈퇴",
      centered: true,
      children: (
        <Stack gap="md">
          <Text size="sm" color="dimmed">
            탈퇴 전 아래 내용을 확인해주세요:
          </Text>

          <Stack gap="xs" pl="md">
            <Text size="sm">
              • 관리자 문의를 통해 <strong>탈퇴 후 일주일 내로 취소</strong>가
              가능합니다.
            </Text>
            <Text size="sm">
              • 탈퇴 후에는{" "}
              <strong>한 달간 동일한 이메일로 재가입이 불가능</strong>합니다.
            </Text>
            <Text size="sm">
              • 탈퇴 시 작성한 게시글 및 댓글은 삭제되지 않습니다.
            </Text>
          </Stack>

          <Divider my="sm" />

          <Text fw={500} ta="center">
            정말 탈퇴하시겠습니까?
          </Text>
        </Stack>
      ),
      labels: { confirm: "탈퇴하기", cancel: "취소" },
      confirmProps: { color: "red" },
      onConfirm: () => withdraw(),
    });
  };

  return (
    <Button
      variant="subtle"
      color="red"
      onClick={handleClick}
      loading={isPending}
    >
      탈퇴하기
    </Button>
  );
};

export default MypageTemplate;
