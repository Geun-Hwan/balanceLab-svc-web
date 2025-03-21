// menuItems.ts

import { currentPath, navigateTo } from "@/routes/router";
import { Button, Menu } from "@mantine/core";
import {
  IconBriefcase,
  IconCat,
  IconCheck,
  IconHomeBolt,
  IconList,
  IconLogin,
  IconLogout,
  IconMailQuestion,
  IconSelect,
  IconSettings,
  IconUserCheck,
  IconUserEdit,
  IconUserPlus,
} from "@tabler/icons-react";
import { JSX } from "react";

// 메뉴 항목을 정의합니다.

type CommonMenuType =
  | "Home"
  | "Contact"
  | "Setting"
  | "Login"
  | "Join"
  | "DrawerLogin";

type LoginMenuType = "MyPage" | "Logout";

type MypageMenuType = "MyGames" | "Participations";

export type MainMenuType = "Balance" | "Prediction";
// MenuItems의 타입 정의
export type MenuItemsType = {
  desktop: Partial<MenuItem>; // 선택적으로 등록
  mobile: Partial<MenuItem>; // 선택적으로 등록
};

export type MenuName =
  | CommonMenuType
  | LoginMenuType
  | MypageMenuType
  | MainMenuType;

export type MenuItem = Record<MenuName, JSX.Element>;

export const getMenuItems = (
  handleLogout?: () => void,
  menuNames?: MenuName[]
): MenuItemsType => {
  // const path = useCurrentPath();
  const menus = {
    desktop: {
      Home: (
        <IconHomeBolt
          size={70}
          key="home"
          onClick={() => {
            navigateTo("/");
          }}
        >
          HOME
        </IconHomeBolt>
      ),
      Contact: (
        <Button
          variant="subtle"
          key="contact"
          onClick={() => navigateTo("/contact")}
          leftSection={<IconMailQuestion />}
        >
          문의하기
        </Button>
      ),
      Setting: (
        <Button
          variant="subtle"
          key="setting"
          onClick={() => navigateTo("/setting")}
          leftSection={<IconSettings />}
        >
          설정
        </Button>
      ),
      Login: (
        <Button
          variant="subtle"
          key="login"
          onClick={() => navigateTo("/login")}
          leftSection={<IconLogin />}
        >
          로그인
        </Button>
      ),
      Join: (
        <Button
          variant="subtle"
          key="join"
          onClick={() => navigateTo("/join")}
          leftSection={<IconUserPlus />}
        >
          가입하기
        </Button>
      ),
      MyGames: (
        <Menu.Item
          key="my-games"
          leftSection={<IconBriefcase size={16} />}
          onClick={() => navigateTo("/my-games")}
        >
          게임관리
        </Menu.Item>
      ),
      Participations: (
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
          onClick={() => navigateTo("/my-participations")}
        >
          참여목록
        </Button>
      ),

      Logout: (
        <Menu.Item
          key="logout"
          leftSection={<IconLogout size={16} />}
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      ),
      MyPage: (
        <Menu.Item
          key={"mypage"}
          leftSection={<IconUserEdit size={16} />}
          onClick={() => navigateTo("/mypage")}
        >
          내 정보 수정
        </Menu.Item>
      ),
      Balance: (
        <Button
          maw={130}
          fullWidth
          key="balance"
          variant={"/balance" === location.pathname ? "filled" : "outline"}
          leftSection={<IconSelect size={20} />}
          onClick={() => navigateTo("/balance")}
        >
          밸런스게임
        </Button>
      ),
      Prediction: (
        <Button
          maw={130}
          fullWidth
          key="prediction"
          variant={"/prediction" === location.pathname ? "filled" : "outline"}
          leftSection={<IconCheck size={20} />}
          onClick={() => {
            navigateTo("/prediction");
          }}
        >
          준비중
        </Button>
      ),
    },
    mobile: {
      Home: (
        <IconCat size={60} key="home-mobile" onClick={() => navigateTo("/")} />
      ),
      Contact: (
        <Button
          miw={125}
          variant="outline"
          key="concat-mobile"
          onClick={() => navigateTo("/contact")}
        >
          문의
        </Button>
      ),

      Setting: (
        <Button
          miw={125}
          key={"setting-mobile"}
          onClick={() => navigateTo("/setting")}
        >
          설정
        </Button>
      ),
      Login: (
        <Button
          maw={80}
          key="login-mobile"
          miw={80}
          variant="outline"
          onClick={() => navigateTo("/login")}
        >
          Login
        </Button>
      ),

      MyGames: (
        <Button
          miw={125}
          onClick={() => navigateTo("/mygames")}
          key={"mygames-mobile"}
        >
          내 게임
        </Button>
      ),
      Participations: (
        <Button
          miw={125}
          onClick={() => navigateTo("/participations")}
          key={"participations-mobile"}
        >
          참여 목록
        </Button>
      ),
      Logout: (
        <Menu.Item
          maw={100}
          fw={900}
          key="logout-mobile"
          onClick={handleLogout}
          leftSection={<IconLogout size={13} />}
        >
          로그아웃
        </Menu.Item>
      ),
      MyPage: (
        <Menu.Item
          fw={900}
          key={"mypage-mobile"}
          leftSection={<IconUserEdit size={13} />}
          onClick={() => navigateTo("/mypage")}
        >
          내 정보 수정
        </Menu.Item>
      ),

      DrawerLogin: (
        <Menu.Item
          mt={"lg"}
          bd={"1px solid gray"}
          key={"mobile-drawerLogin"}
          onClick={() => navigateTo("/login")}
          leftSection={<IconUserCheck size={50} />}
          fz={"h3"}
        >
          로그인후 이용하세요!
        </Menu.Item>
      ),
      Balance: (
        <Button
          radius={20}
          variant={currentPath() === "/balance" ? "filled" : "outline"}
          miw={125}
          key={"balance-mobile"}
          onClick={() => navigateTo("/balance")}
        >
          밸런스게임
        </Button>
      ),
      Prediction: (
        <Button
          radius={20}
          variant={currentPath() === "/prediction" ? "filled" : "outline"}
          miw={125}
          key={"prediction-mobile"}
          onClick={() => navigateTo("/prediction")}
        >
          예측게임
        </Button>
      ),
    },
  };

  if (!!menuNames && menuNames.length > 0) {
    return {
      desktop: Object.fromEntries(
        Object.entries(menus.desktop).filter(([key]) =>
          menuNames.includes(key as MenuName)
        )
      ),
      mobile: Object.fromEntries(
        Object.entries(menus.mobile).filter(([key]) =>
          menuNames.includes(key as MenuName)
        )
      ),
    };
  }

  return menus;
};
