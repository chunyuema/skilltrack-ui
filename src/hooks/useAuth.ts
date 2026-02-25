import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);

  // If context is undefined, it means the hook is used
  // outside of the <AuthProvider> component.
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
