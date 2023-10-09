import { createContext, useCallback } from "react";
import useAuthService from "../services/useAuthService";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { isEmpty } from "lodash";

export const SessionContext = createContext({});

export default function SessionProvider({ children }) {
  const { login } = useAuthService();
  const nav = useNavigate();

  const signIn = useCallback(async (payload) => {
    const loginResponse = await login(payload);

    if (!isEmpty(loginResponse.error)) return loginResponse;

    Cookies.set("session", loginResponse.data.authToken);

    nav(`/chat/${loginResponse.data.user._id}`);

    return loginResponse;
  }, []);

  return (
    <SessionContext.Provider value={{ signIn }}>
      {children}
    </SessionContext.Provider>
  );
}
