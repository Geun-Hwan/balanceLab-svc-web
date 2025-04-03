import { Title } from "@mantine/core";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
const DragHint = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1000); // 3초 후 사라짐
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* 좌측 드래그 힌트 */}
      <motion.div
        initial={{ opacity: 1, x: 0 }}
        animate={{ opacity: 0, x: -10 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "50%",
          left: 10,
          transform: "translateY(-50%)",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        <IconArrowLeft size={50} />
      </motion.div>

      {/* 우측 드래그 힌트 */}
      <motion.div
        initial={{ opacity: 1, x: 0 }}
        animate={{ opacity: 0, x: 10 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "50%",
          right: 10,
          transform: "translateY(-50%)",

          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        <IconArrowRight size={50} />
      </motion.div>
    </>
  );
};

export default DragHint;
