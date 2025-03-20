import { logout } from "@/api/authApi";
import { useUserStore } from "@/store/store";
import { handleLogoutCallback } from "@/utils/loginUtil";
import { Box, Button, Divider, Drawer, Flex, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBriefcase,
  IconCat,
  IconChevronRight,
  IconHome,
  IconList,
  IconLogin,
  IconLogout,
  IconPhone,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { isMobile } from "react-device-detect";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLogin, userData } = useUserStore();
  const [opened, { open, close }] = useDisclosure(false);
  const { mutate: logoutMutate, isPending } = useMutation({
    mutationFn: () => logout(),
    onSuccess: (data, variables, context) => {
      close();
      handleLogoutCallback();
    },
    onError: () => {
      close();

      handleLogoutCallback();
    },
  });

  const handleNavigation = (path: string) => {
    if (location.pathname === path) {
      close();
    } else {
      close();
      navigate(path);
    }
  };

  const MenuItem = {
    Home: (
      <Button
        fullWidth
        display={"flex"}
        bd="none"
        variant="default"
        size="md"
        fw={500}
        style={{ outline: "none" }}
        onClick={() => handleNavigation("/")}
        leftSection={<IconHome size={20} />}
      >
        Home
      </Button>
    ),
    MyGames: (
      <Button
        fullWidth
        display={"flex"}
        bd="none"
        variant="default"
        size="md"
        fw={500}
        style={{ outline: "none" }}
        leftSection={<IconBriefcase size={20} />}
        onClick={() => handleNavigation("/my-games")}
      >
        게임관리
      </Button>
    ),
    Participations: (
      <Button
        fullWidth
        display={"flex"}
        bd="none"
        variant="default"
        size="md"
        fw={500}
        style={{ outline: "none" }}
        leftSection={<IconList size={20} />}
        onClick={() => handleNavigation("/my-participations")}
      >
        참여목록
      </Button>
    ),

    Contact: (
      <Button
        fullWidth
        display={"flex"}
        bd="none"
        variant="default"
        size="md"
        style={{ outline: "none" }}
        fw={500}
        leftSection={<IconPhone size={20} />}
        onClick={() => handleNavigation("/contact")}
      >
        문의하기
      </Button>
    ),
    Setting: (
      <Button
        fullWidth
        display={"flex"}
        bd="none"
        variant="default"
        size="md"
        style={{ outline: "none" }}
        fw={500}
        leftSection={<IconSettings size={20} />}
        onClick={() => handleNavigation("/setting")}
      >
        설정
      </Button>
    ),
    Login: (
      <Button
        fullWidth
        display={"flex"}
        bd="none"
        variant="default"
        size="md"
        style={{ outline: "none" }}
        fw={500}
        leftSection={<IconLogin size={20} />}
        onClick={() => handleNavigation("/login")}
      >
        Login
      </Button>
    ),

    Logout: (
      <Button
        fullWidth
        display={"flex"}
        bd="none"
        variant="default"
        size="md"
        fw={500}
        style={{ outline: "none" }}
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
  const showAppIcon = ["/", "/login"].includes(location.pathname);

  return isMobile ? (
    <Flex
      justify="space-between" // 좌우 정렬
      align="center" // 수직 중앙 정렬
      px="md"
      py="sm"
    >
      {showAppIcon ? (
        <IconCat size={24} onClick={() => navigate("/")} />
      ) : (
        // <IconArrowLeft size={24} onClick={() => navigate(-1)} />
        <IconCat size={24} onClick={() => navigate("/")} />
      )}

      <IconUser
        size={28}
        stroke={1.5}
        style={{ outline: "none" }}
        onClick={open}
      />

      <Drawer
        opened={opened}
        onClose={close}
        position="right"
        size="xs"
        withCloseButton={false}
        styles={{
          body: {
            display: "flex",
            flexDirection: "column",
            height: "100dvh",
          },
        }} // Drawer 높이 지정
      >
        <Flex mb={"md"} justify={"space-between"}>
          {isLogin ? (
            <Text size="lg">{userData?.totalPoint?.toLocaleString()}P</Text>
          ) : (
            <Text></Text>
          )}
          <IconChevronRight
            size={30}
            stroke={1.5}
            onClick={close}
            style={{
              justifySelf: "flex-end",
            }}
          />
        </Flex>

        <Flex direction="column" gap="xl" flex={1}>
          {/* {MenuItem.Home} */}
          {isLogin && (
            <>
              {MenuItem.MyGames}
              {MenuItem.Participations}
            </>
          )}
          {MenuItem.Contact}
          {MenuItem.Setting}
        </Flex>
        {/* 구분선 & 로그인 (최하단) */}
        <Box>
          <Divider my="md" />
          <Box>{isLogin ? MenuItem.Logout : MenuItem.Login}</Box>
        </Box>
      </Drawer>
    </Flex>
  ) : (
    <Flex
      justify="space-between" // 좌우 정렬
      align="center" // 수직 중앙 정렬
      px="md"
      py="sm"
    >
      <Title
        onClick={() => {
          navigate("/");
        }}
      >
        HOME
      </Title>

      <Flex gap={"md"}>
        {isLogin && (
          <>
            {MenuItem.MyGames}
            {MenuItem.Participations}
          </>
        )}
        {MenuItem.Contact}
        {MenuItem.Setting}

        {isLogin ? MenuItem.Logout : MenuItem.Login}
      </Flex>
    </Flex>
  );
};
export default Header;
