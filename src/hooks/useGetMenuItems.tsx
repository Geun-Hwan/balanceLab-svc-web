// menuItems.ts

import { logout } from "@/service/authApi";
import { useAlertStore } from "@/store/store";
import { handleLogoutCallback } from "@/utils/loginUtil";
import { Button, Menu, NavLink, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import {
  IconArrowLeft,
  IconCat,
  IconChartBar,
  IconDeviceGamepad2,
  IconHandClick,
  IconHomeBolt,
  IconList,
  IconLogin,
  IconLogout,
  IconMailQuestion,
  IconQuestionMark,
  IconSettings,
  IconUserCheck,
  IconUserEdit,
  IconUserPlus,
} from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useContentType from "./useContentType";

// 메뉴 항목을 정의합니다.

type BasicMenuName =
  | "Home"
  | "Contact"
  | "Setting"
  | "Login"
  | "MyPage"
  | "Logout";

type MypageMenuName = "MyGames" | "Participations";

type MainMenuName = "Balance" | "Prediction";

type CommonMenuName = BasicMenuName | MypageMenuName | MainMenuName;

export type PcMenuName = CommonMenuName | "Join";
export type MobileMenuName = CommonMenuName | "Back" | "DrawerLogin";

export type MenuName = PcMenuName | MobileMenuName;

export type PcMenuType = Record<CommonMenuName | PcMenuName, () => JSX.Element>;
export type MobileMenuType = Record<
  CommonMenuName | MobileMenuName,
  () => JSX.Element
>;
type MenuItem = PcMenuType & MobileMenuType;

export const useGetMenuItems = (
  isDeskTop: boolean,
  menuNames?: MenuName[]
): MenuItem => {
  const { showAlert } = useAlertStore();

  const { isSmall } = useContentType();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const location = useLocation();

  const { mutate: logoutMutate } = useMutation({
    mutationFn: () => logout(),
    onSuccess: (_data, _variables, _context) => {
      handleLogoutCallback(() => {
        showAlert("로그아웃 완료!");
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

  const handleLogout = () => {
    modals.openConfirmModal({
      modalId: "login_confirm",
      centered: true,
      title: "알림",
      closeOnConfirm: true,
      children: <Text>로그아웃</Text>,
      labels: { confirm: "확인", cancel: "취소" },
      onConfirm: () => logoutMutate(),
      lockScroll: false,
    });
  };

  const handleNavigate = (path: string | number, replace?: false) => {
    if (typeof path === "string") {
      if (location.pathname !== path) {
        navigate(path, { replace });
      }
    } else if (path === -1) {
      if (window.history.length > 1) {
        navigate(-1); // -1일 경우 뒤로 가기
      } else {
        navigate("/");
      }
    }
  };

  const desktopMenus: PcMenuType = {
    Home: () => (
      <IconHomeBolt
        size={70}
        key="home"
        onClick={() => {
          handleNavigate("/");
        }}
      >
        HOME
      </IconHomeBolt>
    ),
    Contact: () => (
      <Menu.Item
        key="contact"
        w={"auto"}
        miw={100}
        onClick={() => handleNavigate("/contact")}
        leftSection={<IconMailQuestion />}
      >
        문의하기
      </Menu.Item>
    ),
    Setting: () => (
      <Menu.Item
        key="setting"
        w={"auto"}
        miw={100}
        onClick={() => handleNavigate("/setting")}
        leftSection={<IconSettings />}
      >
        홈페이지 설정
      </Menu.Item>
    ),
    Login: () => (
      <Menu.Item
        w={"auto"}
        miw={100}
        key="login"
        onClick={() => handleNavigate("/login")}
        leftSection={<IconLogin />}
      >
        로그인
      </Menu.Item>
    ),
    Join: () => (
      <Menu.Item
        w={"auto"}
        miw={100}
        key="join"
        onClick={() => handleNavigate("/join")}
        leftSection={<IconUserPlus />}
      >
        가입하기
      </Menu.Item>
    ),
    MyGames: () => (
      <Menu.Item
        key="my-games"
        leftSection={<IconDeviceGamepad2 size={16} />}
        onClick={() => handleNavigate("/my-games")}
      >
        게임관리
      </Menu.Item>
    ),
    Participations: () => (
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
        onClick={() => handleNavigate("/my-participations")}
      >
        참여목록
      </Button>
    ),
    Logout: () => (
      <Menu.Item
        key="logout"
        leftSection={<IconLogout size={16} />}
        onClick={handleLogout}
      >
        Logout
      </Menu.Item>
    ),
    MyPage: () => (
      <Menu.Item
        key={"mypage"}
        leftSection={<IconUserEdit size={16} />}
        onClick={() => handleNavigate("/mypage")}
      >
        내 정보 수정
      </Menu.Item>
    ),
    Balance: () => (
      <Button
        maw={130}
        flex={1}
        key="balance"
        variant={"/balance" === location.pathname ? "filled" : "light"}
        leftSection={<IconChartBar size={20} />}
        onClick={() => handleNavigate("/balance")}
      >
        밸런스게임
      </Button>
    ),
    Prediction: () => (
      <Button
        maw={130}
        flex={1}
        key="prediction"
        variant={"/predict" === location.pathname ? "filled" : "light"}
        leftSection={<IconQuestionMark size={20} />}
        onClick={() => {
          handleNavigate("/predict");
        }}
      >
        예측하기
      </Button>
    ),
  };

  const mobileMenus: MobileMenuType = {
    Home: () => (
      <IconCat
        size={60}
        key="home-mobile"
        onClick={() => handleNavigate("/")}
      />
    ),
    Contact: () => (
      <NavLink
        key="contact-mobile"
        leftSection={<IconMailQuestion size={16} />}
        onClick={() => handleNavigate("/contact")}
        label="문의하기"
      />
    ),
    Setting: () => (
      <NavLink
        key="setting-mobile"
        leftSection={<IconSettings size={16} />}
        onClick={() => handleNavigate("/setting")}
        label="홈페이지 설정"
      />
    ),
    Login: () => (
      <Button
        maw={80}
        key="login-mobile"
        miw={80}
        variant="outline"
        onClick={() => handleNavigate("/login")}
      >
        Login
      </Button>
    ),
    MyGames: () => (
      <NavLink
        key="mygames-mobile"
        leftSection={<IconDeviceGamepad2 size={16} />}
        label="게임관리"
        onClick={() => handleNavigate("/my-games")}
      />
    ),
    /* 탭 */
    Participations: () => (
      <Button
        miw={125}
        onClick={() => handleNavigate("/participations")}
        key={"participations-mobile"}
      >
        참여 목록
      </Button>
    ),
    Logout: () => (
      <Menu.Item
        fw={900}
        fz={isSmall ? "sm" : "lg"}
        key="logout-mobile"
        w="auto"
        onClick={handleLogout}
        leftSection={<IconLogout size={isSmall ? 13 : 30} />}
      >
        로그아웃
      </Menu.Item>
    ),
    MyPage: () => (
      <Menu.Item
        fw={900}
        w="auto"
        fz={isSmall ? "sm" : "lg"}
        key={"mypage-mobile"}
        leftSection={<IconUserEdit size={isSmall ? 13 : 30} />}
        onClick={() => handleNavigate("/mypage")}
      >
        내 정보 수정
      </Menu.Item>
    ),

    Balance: () => (
      <Button
        radius={20}
        variant={location.pathname === "/balance" ? "filled" : "outline"}
        miw={125}
        key={"balance-mobile"}
        leftSection={<IconChartBar size={20} />}
        onClick={() => handleNavigate("/balance")}
      >
        밸런스게임
      </Button>
    ),
    Prediction: () => (
      <Button
        radius={20}
        variant={location.pathname === "/predict" ? "filled" : "outline"}
        miw={125}
        leftSection={<IconQuestionMark size={20} />}
        key={"prediction-mobile"}
        onClick={() => handleNavigate("/predict")}
      >
        예측게임
      </Button>
    ),

    Back: () => (
      <IconArrowLeft
        size={30}
        style={{ flexGrow: 0 }}
        onClick={() => {
          handleNavigate(-1);
        }}
      />
    ),
    DrawerLogin: () => (
      <Menu.Item
        key={"mobile-drawerLogin"}
        onClick={() => handleNavigate("/login")}
        leftSection={<IconHandClick size={isSmall ? 35 : 50} />}
        fz={isSmall ? "h3" : "h1"}
        fw={"900"}
        p={"xs"}
      >
        로그인하고 포인트 받기
      </Menu.Item>
    ),
  };

  if (!!menuNames && menuNames.length > 0) {
    let menues: MenuName;
    if (isDeskTop) {
      menues = desktopMenus as unknown as MenuName;
    } else {
      menues = mobileMenus as unknown as MenuName;
    }
    return menuNames.reduce((acc: any, key: any) => {
      if (menues[key]) {
        acc[key] = menues[key]; // key에 해당하는 value를 추가
      }
      return acc;
    }, {} as Record<MenuName, () => JSX.Element>);
  }

  if (isDeskTop) {
    return desktopMenus as MenuItem;
  } else {
    return mobileMenus as MenuItem;
  }
};
