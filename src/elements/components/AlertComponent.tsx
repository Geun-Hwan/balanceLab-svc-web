import { useAlertStore } from "@/libs/store/store";

import { Alert, Flex, Text } from "@mantine/core";
import {
  IconAlertCircle,
  IconCheck,
  IconExclamationMark,
  IconInfoCircle,
} from "@tabler/icons-react";

const AlertComponent = () => {
  const { alertMessage, alertVisible, hideAlert, alertType } = useAlertStore();

  const getIconAndColor = () => {
    switch (alertType) {
      case "success":
        return { icon: <IconCheck size={18} />, color: "green" };
      case "error":
        return { icon: <IconExclamationMark size={18} />, color: "red" };
      case "warning":
        return { icon: <IconAlertCircle size={18} />, color: "yellow" };
      default:
        return { icon: <IconInfoCircle size={18} />, color: "blue" };
    }
  };
  const { icon, color } = getIconAndColor();

  return alertVisible ? (
    <Flex
      pos="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100vh"
      bg={"rgb(0,0,0,0.7)"}
      style={{
        zIndex: 100,
      }}
      align={"center"}
      justify={"center"}
      onClick={hideAlert}
    >
      <Alert
        maw={400} // 최대 너비 설정
        style={{
          zIndex: 999, // 알림을 배경 위로 올리기
        }}
        pos="absolute"
        top={"40%"}
        bg={"#fff"}
        w="80%"
        icon={icon}
        title="알림"
        color={color}
        withCloseButton
        onClose={hideAlert}
        radius="md"
      >
        <Text style={{ color: "#000" }}>{alertMessage}</Text>
      </Alert>
    </Flex>
  ) : null;
};

export default AlertComponent;
