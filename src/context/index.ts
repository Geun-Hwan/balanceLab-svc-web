import { createContext, useContext } from "react";

export const DesktopViewContext = createContext<boolean | undefined>(undefined);

export const useDesktopView = () => {
  const context = useContext(DesktopViewContext);
  if (context === undefined) {
    throw new Error("useDesktopView must be used within a DesktopViewProvider");
  }
  return context;
};
