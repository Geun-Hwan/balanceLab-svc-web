import { createContext, useContext } from "react";

export const DesktopHeaderContext = createContext<boolean | undefined>(
  undefined
);

export const useDesktopHeader = () => {
  const context = useContext(DesktopHeaderContext);

  return context;
};
