import { Stack } from "@mantine/core";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

const PcSelectAnimation = ({
  isSelect,
  label,
  ratio,
  color,
  width = "50%",
  h = 250,
}: any) => {
  const [isAnimate, setIsAnimate] = useState(false);

  useEffect(() => {
    if (isSelect) {
      setIsAnimate(true);
    }
  }, [isSelect]);

  return (
    <Stack flex={1} align="center" h={h} gap={0}>
      <motion.div
        onAnimationEnd={() => setIsAnimate(false)}
        initial={{ scaleX: isAnimate ? 0 : ratio }}
        animate={{ scaleX: isAnimate ? ratio : 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
        style={{
          height: "100%",
          backgroundColor: color,
          width: width,
          transform: `scaleX(${ratio})`,
          transformOrigin: "left",
          borderRadius: "5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 10px",
        }}
      />

      {/* 레이블 */}

      {/* <Text style={{ fontWeight: "bold" }} ta={"center"} mt={"md"}>
          {label}
        </Text>
        <Text style={{ fontWeight: "bold" }} ta={"center"}>
          {`${isSelect ? (ratio * 100).toFixed(1) : "??"}%`}
        </Text> */}
    </Stack>
  );
};

export default PcSelectAnimation;
