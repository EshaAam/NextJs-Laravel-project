import { useContext } from "react";
import { AppContext } from "@/context/AppProvider";

export const useAuth = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error("useAuth must be used within AppProvider");
  }
  
  return context;
};
