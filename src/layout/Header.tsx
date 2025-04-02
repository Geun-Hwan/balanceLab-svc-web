import { ILoginResult } from "@/api/authApi";
import { useDesktopHeader } from "@/context/headerContext";
import useContentType from "@/hooks/useContentType";
import { useUserStore } from "@/store/store";
import {
  Button,
  CloseButton,
  Divider,
  Drawer,
  Flex,
  Group,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMenu2, IconUser } from "@tabler/icons-react";
import React from "react";
import {
  MenuName,
  MobileMenuType,
  PcMenuType,
  useGetMenuItems,
} from "../hooks/useGetMenuItems";

const Header = ({ name }: { name?: MenuName }) => {
  const isDesktopView = useDesktopHeader();
  const { isLogin, userData } = useUserStore();

  const MenuItems = useGetMenuItems(isDesktopView as boolean);

  return (
    <>
      {isDesktopView ? (
        <Header.DeskTop
          MenuItems={MenuItems}
          userData={userData}
          isLogin={isLogin}
        />
      ) : (
        <Header.Mobile
          MenuItems={MenuItems}
          name={name}
          userData={userData}
          isLogin={isLogin}
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
  MenuItems: PcMenuType;

  isLogin: boolean;
  userData: ILoginResult | null;
}) => {
  const DeskTopDropDown = () => {
    return (
      <Menu>
        <Menu.Target>
          <Button
            w={"auto"}
            key="mypage"
            variant="transparent"
            leftSection={<IconUser />}
          >
            내정보
          </Button>
        </Menu.Target>

        <Menu.Dropdown flex={1}>
          <Menu.Label fz={"lg"}>
            <Flex gap={"md"} align={"center"} justify={"center"}>
              <Text fw={900} ta={"left"} flex={1} lineClamp={1}>
                {userData?.nickName}
              </Text>
              <Text fw={700} c={"blue"} ta={"right"} lineClamp={1}>
                {userData?.totalPoint.toLocaleString()}P
              </Text>
            </Flex>
          </Menu.Label>

          <MenuItems.MyPage />

          <MenuItems.MyGames />
          <Menu.Divider />
          <MenuItems.Logout />
        </Menu.Dropdown>
      </Menu>
    );
  };

  return (
    <Group align={"flex-start"} w={"100%"} py={"md"} mih={80} mx={"auto"}>
      {MenuItems.Home && <MenuItems.Home />}

      <Stack flex={1} gap={"sm"}>
        <Flex justify={"flex-end"} gap={"xs"}>
          <Menu closeOnItemClick closeOnClickOutside>
            {[
              <MenuItems.Setting />,
              <MenuItems.Contact />,
              !isLogin && <MenuItems.Login />,
              !isLogin && <MenuItems.Join />,
              isLogin && <DeskTopDropDown />,
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
          </Menu>
        </Flex>

        <Flex gap={"md"} mt={"lg"}>
          <MenuItems.Balance />
          <MenuItems.Prediction />
        </Flex>
      </Stack>
    </Group>
  );
};

Header.Mobile = ({
  MenuItems,
  name,
  isLogin,
  userData,
}: {
  MenuItems: MobileMenuType;
  name?: MenuName;
  isLogin: boolean;
  userData: ILoginResult | null;
}) => {
  const MobileDrawerMenu = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const { isSmall } = useContentType();
    return (
      <Menu>
        <Menu.Target>
          <IconMenu2 size={30} style={{ flexGrow: 0 }} onClick={open} />
        </Menu.Target>

        <Drawer
          opened={opened}
          onClose={close}
          size={isSmall ? "xs" : "md"}
          position="right"
          withCloseButton={false}
          styles={{
            body: {
              height: "100%",
              flexDirection: "column",
              display: "flex",
            },
          }}
        >
          <Flex mb={"md"} align="center" gap={"xs"}>
            <CloseButton
              size={isSmall ? 30 : 50}
              onClick={close}
              variant="transparent"
              bd={0}
              style={{ outline: "none" }}
            />

            {isLogin ? (
              <Flex direction={"column"} w={"100%"}>
                <Flex align={"center"} justify={"space-between"}>
                  <Text
                    ta={"left"}
                    fw={900}
                    lineClamp={1}
                    fz={isSmall ? "h4" : "h3"}
                    style={{
                      wordBreak: "break-word",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {userData?.nickName}
                  </Text>
                  <Flex>
                    <Text
                      ta={"right"}
                      fz={isSmall ? "sm" : "md"}
                      c="blue"
                      fw={900}
                      lineClamp={1}
                      style={{
                        wordBreak: "break-word",

                        textOverflow: "ellipsis",
                      }}
                    >
                      {userData?.totalPoint.toLocaleString()}
                    </Text>
                    <Text
                      ta={"right"}
                      fz={isSmall ? "sm" : "md"}
                      c="blue.3"
                      fw={900}
                    >
                      P
                    </Text>
                  </Flex>
                </Flex>
                <Text
                  ta={"left"}
                  fw={700}
                  fz={isSmall ? "xs" : "sm"}
                  c={"gray"}
                  flex={1}
                >
                  {userData?.email}
                </Text>
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
            {isLogin ? (
              <>
                <MenuItems.MyGames />
              </>
            ) : (
              <MenuItems.DrawerLogin />
            )}
            <MenuItems.Contact />
            <MenuItems.Setting />
          </Stack>
          <Stack pt={"md"}>
            <Flex
              justify={"space-between"}
              align={"center"}
              mih={35}
              w={"100%"}
            >
              {isLogin && (
                <>
                  <MenuItems.MyPage /> <MenuItems.Logout />
                </>
              )}
            </Flex>
          </Stack>
        </Drawer>
      </Menu>
    );
  };
  return (
    <Group align={"center"} w={"100%"} pt={"xs"} mih={70} mx={"auto"}>
      <Group grow miw={80} flex={1}>
        {/* {name !== "Login" && name !== "Join" && <MobileDrawerMenu />} */}
        {name !== "Login" && name !== "Home" && <MenuItems.Back />}
      </Group>

      <Group justify="center">{<MenuItems.Home />}</Group>

      <Group grow miw={80} flex={1} justify="flex-end">
        {name !== "Login" && name !== "Join" && <MobileDrawerMenu />}
      </Group>
    </Group>
  );
};

export default Header;
