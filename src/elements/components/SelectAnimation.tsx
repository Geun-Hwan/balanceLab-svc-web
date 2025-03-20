import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const SelectAnimation = ({ isSelect, percent, color, duration = 1 }: any) => {
  const [isAnimate, setIsAnimate] = useState(false);

  useEffect(() => {
    if (isSelect) {
      setIsAnimate(true);
    } else {
      setIsAnimate(false);
    }
  }, [isSelect]);

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: isAnimate ? `${percent}%` : 0 }}
      transition={{ duration, ease: "easeInOut" }} // 애니메이션 지속 시간
      style={{
        backgroundColor: color,
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    />
  );
};

export default SelectAnimation;
