import { logout } from "@/libs/api/authApi";
import { useUserStore } from "@/libs/store/store";
import { handleLogoutCallback } from "@/libs/utils/loginUtil";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Flex,
  Text,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBriefcase,
  IconChevronRight,
  IconHome,
  IconLogin,
  IconLogout,
  IconMenu2,
  IconPhone,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { isMobile } from "react-device-detect";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  return (
    <Flex
      justify="space-between" // 좌우 정렬
      align="center" // 수직 중앙 정렬
      px="md"
      py="sm"
    >
      {/* 로고 */}
      <Text bd="none" size="lg" fw={700}>
        My App
      </Text>
      <Menu />
    </Flex>
  );
};

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLogin } = useUserStore();
  const [opened, { toggle, close }] = useDisclosure(false);
  const { mutate: logoutMutate, isPending } = useMutation({
    mutationFn: () => logout(),
    onSuccess: (data, variables, context) => {
      close();
      handleLogoutCallback();

      navigate("/login");
    },
    onError: () => {
      close();

      handleLogoutCallback();
      navigate("/login");
    },
  });

  const MenuItem = {
    Home: (
      <Button
        bd="none"
        variant="default"
        size="md"
        fw={500}
        style={{ outline: "none" }}
        onClick={() => {
          if (location.pathname === "/") {
            close();
          } else {
            close();
            navigate("/");
          }
        }}
        leftSection={<IconHome size={20} />}
      >
        Home
      </Button>
    ),
    Service: (
      <Button
        bd="none"
        variant="default"
        size="md"
        fw={500}
        style={{ outline: "none" }}
        leftSection={<IconBriefcase size={20} />}
        onClick={() => {
          if (location.pathname === "/service") {
            close();
          } else {
            close();
            navigate("/service");
          }
        }}
      >
        Services
      </Button>
    ),
    Contact: (
      <Button
        bd="none"
        variant="default"
        size="md"
        style={{ outline: "none" }}
        fw={500}
        leftSection={<IconPhone size={20} />}
        onClick={() => {
          if (location.pathname === "/contact") {
            close();
          } else {
            close();
            navigate("/contact");
          }
        }}
      >
        Contact
      </Button>
    ),
    Login: (
      <Button
        bd="none"
        variant="default"
        size="md"
        style={{ outline: "none" }}
        fw={500}
        leftSection={<IconLogin size={20} />}
        onClick={() => {
          if (location.pathname === "/login") {
            close();
          } else {
            close();
            navigate("/login");
          }
        }}
      >
        Login
      </Button>
    ),

    Logout: (
      <Button
        bd="none"
        variant="default"
        size="md"
        fw={500}
        onClick={() => {
          if (!isPending) {
            logoutMutate();
          }
        }}
        leftSection={<IconLogout size={20} />}
      >
        Logout
      </Button>
    ),
  };

  return isMobile ? (
    // ✅ 모바일: 햄버거 메뉴

    <>
      <IconMenu2
        size={28}
        stroke={1.5}
        style={{ outline: "none" }}
        onClick={toggle}
      />

      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="xs"
        withCloseButton={false}
        styles={{
          body: { display: "flex", flexDirection: "column", height: "100vh" },
        }} // Drawer 높이 지정
      >
        <Flex justify="flex-end" mb={"md"}>
          <IconChevronRight size={30} stroke={1.5} onClick={close} />
        </Flex>

        <Flex direction="column" gap="xl" flex={1}>
          <Box>{MenuItem.Home}</Box>
          <Box>{MenuItem.Service}</Box>
          <Box>{MenuItem.Contact}</Box>
        </Flex>
        {/* 구분선 & 로그인 (최하단) */}
        <Box>
          <Divider my="md" />
          <Box>{isLogin ? MenuItem.Logout : MenuItem.Login}</Box>
        </Box>
      </Drawer>
    </>
  ) : (
    // ✅ 웹: 네비게이션 메뉴
    <Flex gap="md">
      {MenuItem.Home}
      {MenuItem.Service}
      {MenuItem.Contact}
      {isLogin ? MenuItem.Logout : MenuItem.Login}
    </Flex>
  );
};
export default Header;
