import { ILoginResult, logout } from "@/api/authApi";
import { useDesktopView } from "@/context";
import { useAlertStore, useUserStore } from "@/store/store";
import { handleLogoutCallback } from "@/utils/loginUtil";
import {
  Button,
  Divider,
  Drawer,
  Flex,
  Group,
  Menu,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconChevronLeft, IconMenu2, IconUser } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getMenuItems, MenuItem, MenuItemsType, MenuName } from "./menu";

const Header = ({ name }: { name?: MenuName }) => {
  const location = useLocation();
  const isDesktopView = useDesktopView();
  const { isLogin, userData } = useUserStore();
  const { showAlert } = useAlertStore();

  const { mutate: logoutMutate, isPending } = useMutation({
    mutationFn: () => logout(),
    onSuccess: (data, variables, context) => {
      handleLogoutCallback(() => showAlert("로그아웃 완료!"));
    },
    onError: () => {
      handleLogoutCallback();
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
    });
  };
  const MenuItems: MenuItemsType = useMemo(() => {
    return getMenuItems(handleLogout);
  }, [handleLogout]);

  return (
    <>
      {isDesktopView ? (
        <Header.DeskTop
          MenuItems={MenuItems["desktop"]}
          userData={userData}
          isLogin={isLogin}
        />
      ) : (
        <Header.Mobile
          MenuItems={MenuItems["mobile"]}
          name={name}
          userData={userData}
          isLogin={isLogin}
          // open={open}
          // opened={opened}
          // close={close}
        />
      )}
    </>
  );
};

Header.DeskTop = ({
  MenuItems,

  isLogin,
  userData,
}: {
  MenuItems: Partial<MenuItem>;

  isLogin: boolean;
  userData: ILoginResult | null;
}) => {
  const DeskTopUserMenu = () => {
    return (
      <Menu shadow="md" closeOnItemClick closeOnClickOutside={true}>
        <Menu.Target>
          <Button key="mypage" variant="subtle" leftSection={<IconUser />}>
            내정보
          </Button>
        </Menu.Target>

        <Menu.Dropdown flex={1}>
          <Menu.Label fz={"lg"}>
            <Flex gap={"md"} align={"center"} justify={"center"}>
              <Text fw={900} ta={"left"} flex={1} lineClamp={1}>
                {userData?.nickNm}
              </Text>
              <Text fw={700} c={"blue"} ta={"right"} lineClamp={1}>
                {userData?.totalPoint.toLocaleString()}P
              </Text>
            </Flex>
          </Menu.Label>

          {MenuItems.MyPage}

          {MenuItems.MyGames}

          <Menu.Divider />

          {MenuItems.Logout}
        </Menu.Dropdown>
      </Menu>
    );
  };

  return (
    <>
      <Group align={"flex-start"} w={"70%"} py={"md"} mih={80} mx={"auto"}>
        {MenuItems.Home}

        <Stack flex={1} gap={"xs"}>
          <Flex justify={"flex-end"} gap={"xs"}>
            {[
              MenuItems.Setting,
              MenuItems.Contact,
              isLogin && <DeskTopUserMenu />,
              !isLogin && MenuItems.Login,
              !isLogin && MenuItems.Join,
            ]
              .filter(Boolean)
              .map((item, index, array) => (
                <React.Fragment key={index}>
                  {item}
                  {index < array.length - 1 && (
                    <Divider orientation="vertical" />
                  )}
                </React.Fragment>
              ))}
          </Flex>

          <Menu>
            <Flex gap={"md"} mt={"md"} ml={50}>
              {[MenuItems.Balance, MenuItems.Prediction]}
            </Flex>
          </Menu>
        </Stack>
      </Group>
    </>
  );
};

Header.Mobile = ({
  MenuItems,
  name,
  isLogin,
  userData,
}: {
  MenuItems: Partial<MenuItem>;
  name?: MenuName;
  isLogin: boolean;
  userData: ILoginResult | null;
}) => {
  const MobileDrawerMenu = () => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
      <Menu>
        <Menu.Target>
          <IconMenu2 size={25} style={{ flexGrow: 0 }} onClick={open} />
        </Menu.Target>

        <Drawer
          opened={opened}
          onClose={close}
          size="xs"
          withCloseButton={false}
          miw={320}
          styles={{
            body: {
              height: "100%",
              flexDirection: "column",
              display: "flex",
              minWidth: 320,
            },
          }}
        >
          <Flex mb={"md"}>
            <IconChevronLeft size={30} stroke={1.5} onClick={close} />

            {isLogin ? (
              <Flex
                direction={"column"}
                justify={"flex-start"}
                flex={1}
                gap={"xs"}
                pl={"xs"}
              >
                <Flex justify={"space-between"} align={"center"}>
                  <Text
                    ta={"left"}
                    fw={900}
                    lineClamp={1}
                    flex={1}
                    fz={"lg"}
                    style={{
                      textOverflow: "ellipsis",
                    }}
                  >
                    {userData?.nickNm}
                  </Text>
                  <Text
                    ta={"right"}
                    size="sm"
                    c="blue"
                    fw={900}
                    flex={1}
                    lineClamp={1}
                    style={{
                      textOverflow: "ellipsis",
                    }}
                  >
                    {userData?.totalPoint.toLocaleString()}P
                  </Text>
                </Flex>
              </Flex>
            ) : (
              <Stack flex={1} gap={"md"}>
                <Flex
                  justify={"space-between"}
                  flex={1}
                  pl={"md"}
                  className="blur"
                >
                  <Flex direction="column">
                    <Text ta={"left"} fw={900}>
                      닉네임인것
                    </Text>
                    <Text ta={"left"} size="sm" c="gray" fw={900}>
                      12345P
                    </Text>
                  </Flex>
                  <Text c={"blue"}>수정하는것</Text>
                </Flex>
              </Stack>
            )}
          </Flex>
          <Stack gap={"xl"} flex={1} pt={"xl"}>
            {isLogin ? [MenuItems.MyGames] : MenuItems.DrawerLogin}

            {[MenuItems.Contact, MenuItems.Setting]}
          </Stack>
          <Stack pt={"md"}>
            <Group
              justify={"space-between"}
              align={"center"}
              grow
              flex={1}
              mih={35}
              mah={50}
            >
              {isLogin && [MenuItems.MyPage, MenuItems.Logout]}
            </Group>
          </Stack>
        </Drawer>
      </Menu>
    );
  };
  return (
    <Group align={"center"} w={"100%"} pt={"xs"} mih={70} mx={"auto"}>
      <Group grow miw={80} flex={1}>
        {name !== "Login" && name !== "Join" && <MobileDrawerMenu />}
      </Group>

      <Group justify="center">{MenuItems.Home}</Group>

      <Group grow miw={80} flex={1} justify="flex-end">
        {name !== "Login" && !isLogin && MenuItems.Login}
      </Group>
    </Group>
  );
};

export default Header;

Header.MobileSubHeader = () => {
  const MainItems = getMenuItems(undefined, ["Balance", "Prediction"])[
    "mobile"
  ];

  return (
    <ScrollArea w="90dvw" type="never" mt={"md"}>
      <Flex gap={"sm"}>{Object.values(MainItems)}</Flex>
    </ScrollArea>
  );
};
