import { createContext, useContext } from "react";

export const DesktopHeaderContext = createContext<boolean | undefined>(
  undefined
);

export const useDesktopHeader = () => {
  const context = useContext(DesktopHeaderContext);
  if (context === undefined) {
    throw new Error(
      "useDesktopHeader must be used within a DesktopViewProvider"
    );
  }
  return context;
};
