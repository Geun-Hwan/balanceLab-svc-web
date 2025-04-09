import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const FadeHint = ({ position }: { position: "left" | "right" }) => {
  const isLeft = position === "left";
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -10 : 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isLeft ? -10 : 10 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{
        position: "absolute",
        bottom: "50%",
        [position]: 10,
        transform: "translateY(-50%)",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      {isLeft ? <IconArrowLeft size={36} /> : <IconArrowRight size={36} />}
    </motion.div>
  );
};

const DragHint = ({
  atLeftEnd,
  atRightEnd,
}: {
  atLeftEnd: boolean;
  atRightEnd: boolean;
}) => {
  const [showLeftHint, setShowLeftHint] = useState(false);
  const [showRightHint, setShowRightHint] = useState(false);

  // 공통 함수: 일정 시간 후 힌트 사라지게
  const triggerHint = (direction: "left" | "right") => {
    if (direction === "left") {
      setShowLeftHint(true);
      setTimeout(() => setShowLeftHint(false), 1000);
    } else {
      setShowRightHint(true);
      setTimeout(() => setShowRightHint(false), 1000);
    }
  };
  useEffect(() => {
    if (atLeftEnd) triggerHint("right"); // 왼쪽 끝이면 → 힌트
  }, [atLeftEnd]);

  useEffect(() => {
    if (atRightEnd) triggerHint("left"); // 오른쪽 끝이면 ← 힌트
  }, [atRightEnd]);

  return (
    <>
      <AnimatePresence>
        {showLeftHint && <FadeHint position="left" />}
      </AnimatePresence>
      <AnimatePresence>
        {showRightHint && <FadeHint position="right" />}
      </AnimatePresence>
    </>
  );
};

export default DragHint;
