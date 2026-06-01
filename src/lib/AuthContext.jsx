import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ id: "local-user", role: "admin", name: "Mama" });
  const isAuthenticated = Boolean(user);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoadingAuth: false,
      isLoadingPublicSettings: false,
      authError: null,
      authChecked: true,
      appPublicSettings: null,
      checkUserAuth: async () => user,
      checkAppState: async () => null,
      logout: () => setUser(null),
      navigateToLogin: () => setUser({ id: "local-user", role: "admin", name: "Mama" }),
    }),
    [user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
