import { logout } from "@/api/authApi";
import { useDesktopView } from "@/context";
import { useUserStore } from "@/store/store";
import { handleLogoutCallback } from "@/utils/loginUtil";
import {
  Anchor,
  Box,
  Button,
  Drawer,
  Flex,
  Group,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconBriefcase,
  IconCat,
  IconCheck,
  IconChevronRight,
  IconHomeBolt,
  IconList,
  IconLogout,
  IconPhone,
  IconSelect,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import React, { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type CommonMenuType =
  | "Home"
  | "Contact"
  | "Setting"
  | "Login"
  | "Join"
  | "Balance"
  | "Prediction";

type LoginMenuType = "MyPage" | "Logout" | "Point";

type MypageMenuType = "MyGames" | "Participations";
export type MenuName = CommonMenuType | LoginMenuType | MypageMenuType;

type MenuItem = React.ReactNode;

// MenuItems의 타입 정의
type MenuItemsType = {
  desktop: Record<MenuName, MenuItem>;

  mobile: Record<MenuName, MenuItem>;
};

const Header = ({ name }: { name?: MenuName }) => {
  const location = useLocation();
  const isDesktopView = useDesktopView();

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
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    if (location.pathname === path) {
      return;
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    modals.openConfirmModal({
      modalId: "login_confirm",
      centered: true,
      title: "알림",
      closeOnConfirm: true,
      children: <Text>로그아웃</Text>,
      labels: { confirm: "확인", cancel: "취소" },
      onConfirm: () => logoutMutate(),
    });
  };

  const MenuItems: MenuItemsType = {
    desktop: {
      Home: (
        <IconHomeBolt
          size={50}
          key="home"
          onClick={() => {
            handleNavigation("/");
          }}
        >
          HOME
        </IconHomeBolt>
      ),
      Contact: (
        <Header.DeskTopMenuButton
          key="contact"
          isActive={"/contact" === location.pathname}
          icon={<IconPhone size={20} />}
          callback={() => handleNavigation("/contact")}
          title="고객지원"
        />
      ),
      Setting: (
        <Header.DeskTopMenuButton
          key="setting"
          isActive={"/setting" === location.pathname}
          icon={<IconSettings size={20} />}
          callback={() => handleNavigation("/setting")}
          title="설정"
        />
      ),
      Login: name !== "Login" && !isLogin && (
        <Anchor
          key="login"
          onClick={() => handleNavigation("/login")}
          td={"underline"}
        >
          로그인
        </Anchor>
      ),
      Join: name !== "Join" && !isLogin && (
        <Anchor
          key="join"
          onClick={() => handleNavigation("/join")}
          td={"underline"}
        >
          가입하기
        </Anchor>
      ),
      MyGames: isLogin && (
        <Button
          miw={125}
          maw={150}
          key="my-games"
          fullWidth
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
      Participations: isLogin && (
        <Button
          miw={125}
          maw={150}
          key="participations"
          fullWidth
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
      Point: isLogin && (
        <Anchor key={"point"}>{userData?.totalPoint.toLocaleString()}P</Anchor>
      ),

      Logout: isLogin && (
        <Anchor key="logout" onClick={handleLogout} td={"underline"}>
          로그아웃
        </Anchor>
      ),
      MyPage: isLogin && (
        <Anchor key="mypage" onClick={undefined} td={"underline"}>
          마이
        </Anchor>
      ),
      Balance: (
        <Header.DeskTopMenuButton
          key="balance"
          isActive={"/balance" === location.pathname}
          icon={<IconSelect size={20} />}
          title="밸런스게임"
          callback={() => handleNavigation("/balance")}
        />
      ),

      Prediction: (
        <Header.DeskTopMenuButton
          key="prediction"
          isActive={"/prediction" === location.pathname}
          icon={<IconCheck size={20} />}
          title="준비중"
          callback={() => {
            handleNavigation("/prediction");
          }}
        />
      ),
    },

    mobile: {
      Home: (
        <IconCat
          size={24}
          key="home-mobile"
          onClick={() => handleNavigation("/")}
        />
      ),
      Contact: (
        <Button miw={125} onClick={() => handleNavigation("/contact")}>
          문의
        </Button>
      ),
      Point: (
        <Anchor key={"mobile-point"}>
          {userData?.totalPoint.toLocaleString()}P
        </Anchor>
      ),

      Setting: (
        <Button miw={125} onClick={() => handleNavigation("/setting")}>
          설정
        </Button>
      ),
      Login: name !== "Login" && !isLogin && (
        <Button
          maw={150}
          key="login-mobile"
          miw={80}
          variant="outline"
          onClick={() => handleNavigation("/login")}
        >
          Login
        </Button>
      ),
      Join: name !== "Join" && name !== "Login" && !isLogin && (
        <Button
          maw={150}
          key="join-mobile"
          miw={80}
          onClick={() => handleNavigation("/join")}
        >
          Join
        </Button>
      ),
      MyGames: isLogin && (
        <Button miw={125} onClick={() => handleNavigation("/mygames")}>
          내 게임
        </Button>
      ),
      Participations: isLogin && (
        <Button miw={125} onClick={() => handleNavigation("/participations")}>
          참여 목록
        </Button>
      ),
      Logout: isLogin && (
        <Button
          maw={150}
          key="logout-mobile"
          miw={80}
          onClick={handleLogout}
          variant="subtle"
          leftSection={<IconLogout size={15} />}
        >
          Logout
        </Button>
      ),

      MyPage: isLogin && (
        <IconUser
          key={"mypage-mobile"}
          size={28}
          stroke={1.5}
          style={{ outline: "none" }}
          onClick={open}
        />
      ),
      Balance: (
        <Button
          miw={125}
          key={"balance-mobile"}
          onClick={() => handleNavigation("/balance")}
        >
          밸런스게임
        </Button>
      ),
      Prediction: (
        <Button
          miw={125}
          key={"prediction-mobile"}
          onClick={() => handleNavigation("/prediction")}
        >
          밸런스게임
        </Button>
      ),
    },
  };

  return (
    <Box mb={"md"}>
      <Stack gap={"xs"} flex={1}>
        <Group
          justify={isDesktopView ? "flex-end" : "space-between"}
          pt={"xs"}
          flex={1}
          w={"100%"}
          align="center"
          mih={isDesktopView ? undefined : 60}
        >
          {isDesktopView ? (
            [
              MenuItems.desktop.Point,

              MenuItems.desktop.Login,
              MenuItems.desktop.Join,
              MenuItems.desktop.MyPage,
              MenuItems.desktop.Logout,
            ]
          ) : (
            <React.Fragment>
              {MenuItems.mobile.Home}
              <Group justify="flex-end">
                {[
                  MenuItems.mobile.Login,
                  MenuItems.mobile.Join,
                  MenuItems.mobile.MyPage,
                ]}
              </Group>
            </React.Fragment>
          )}
        </Group>
        {isDesktopView ? (
          <Group flex={1}>
            {MenuItems.desktop.Home}

            <Flex justify={"flex-start"} flex={1} gap={"md"}>
              {[MenuItems.desktop.Balance, MenuItems.desktop.Prediction]}
            </Flex>

            <Flex justify={"flex-end"} flex={1} gap={"md"}>
              {[MenuItems.desktop?.MyGames, MenuItems.desktop?.Participations]}

              {[MenuItems.desktop.Contact, MenuItems.desktop.Setting]}
            </Flex>
          </Group>
        ) : (
          <Group>{MenuItems.mobile.Balance}</Group>
        )}
      </Stack>

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
          {MenuItems.mobile.Point}
          <Text></Text>

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
          {/* {PublicMenu.Home} */}
          {[MenuItems.mobile.Logout]}
        </Flex>
        {/* 구분선 & 로그인 (최하단) */}
        {/* <Box>
              <Divider my="md" />
              <Box>{isLogin ? LoginMenu?.Logout : PublicMenu.Login}</Box>
            </Box> */}
      </Drawer>
    </Box>
  );
};

Header.DeskTopMenuButton = ({
  icon,
  title,
  callback,
  isActive,
}: {
  icon?: ReactNode;

  title: string;
  callback?: (data?: any) => void;
  isActive: boolean;
}) => {
  return (
    <Button
      miw={125}
      maw={150}
      fullWidth
      bd="none"
      variant={isActive ? "filled" : "default"}
      size="md"
      fw={500}
      style={{ outline: "none" }}
      leftSection={icon}
      onClick={callback}
    >
      {title}
    </Button>
  );
};

export default Header;
