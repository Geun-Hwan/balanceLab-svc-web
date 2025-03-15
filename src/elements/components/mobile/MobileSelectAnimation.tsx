import { Box, Group, Skeleton, Stack, Text } from "@mantine/core";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const MobileBarAnimation = ({
  isSelect,
  label,
  ratio,
  color,
  width = "50%",
}: any) => {
  const [isAnimate, setIsAnimate] = useState(false);

  useEffect(() => {
    if (isSelect) {
      setIsAnimate(true);
    } else {
      setIsAnimate(false);
    }
  }, [isSelect]);
  return (
    <Stack flex={1} align="center" h={250} gap={0}>
      <motion.div
        onAnimationEnd={() => setIsAnimate(false)}
        initial={{ scaleY: isAnimate ? 0 : ratio }}
        animate={{ scaleY: isAnimate ? ratio : 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        style={{
          backgroundColor: color,
          width: width,
          flex: 1,
          textAlign: "center",
          fontWeight: "bold",
          borderRadius: "5px",
          alignItems: "center",
          justifyContent: "center",
          transformOrigin: "bottom",
        }}
      />

      {/* 레이블 */}

      <Text style={{ fontWeight: "bold" }} ta={"center"} mt={"md"}>
        {label}
      </Text>
      <Text style={{ fontWeight: "bold" }} ta={"center"}>
        {`${isSelect ? (ratio * 100).toFixed(1) : "??"}%`}
      </Text>
    </Stack>
  );
};

export default MobileBarAnimation;
