import { createContext, useCallback, useEffect, useState } from "react";
import useAuthService from "../services/useAuthService";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import { isEmpty } from "lodash";

export const SessionContext = createContext({});

export default function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const { pathname } = location;
  const { login, verifyAuth } = useAuthService();
  const nav = useNavigate();

  useEffect(() => {
    const fetchAndVerifySession = async () => {
      const storedSession = Cookies.get("session");
      if (pathname === "/try") {
        setIsLoading(false);
        return;
      }

      if (storedSession) {
        try {
          const veriedSession = await verifyAuth();
          if (!veriedSession) {
            Cookies.remove("session");
            nav("/");
            return;
          }
          if (veriedSession?.role === "USER") {
            nav(`/chat/${veriedSession?._id}`);
          } else if (
            veriedSession?.role === "STAFF" ||
            veriedSession?.role === "ADMIN"
          ) {
            nav("/staff");
          }

          setSession({ ...veriedSession });
        } catch (err) {
          setSession(null);
          nav("/");
        }
      } else {
        nav("/");
      }
      setIsLoading(false);
    };
    fetchAndVerifySession();
  }, []);

  const signIn = useCallback(async payload => {
    const loginResponse = await login(payload);

    if (!isEmpty(loginResponse.error)) return loginResponse;

    Cookies.set("session", loginResponse.data.authToken);

    setSession(loginResponse.data?.user);

    if (loginResponse.data?.user?.role === "USER") {
      nav(`/chat/${loginResponse.data.user._id}`);
    } else if (
      loginResponse.data?.user?.role === "STAFF" ||
      loginResponse.data?.user?.role === "ADMIN"
    ) {
      nav("/staff");
    }
    return loginResponse;
  }, []);

  const signOut = useCallback(() => {
    Cookies.remove("session");
    nav("/");
  }, []);

  return (
    <SessionContext.Provider value={{ signIn, signOut, session, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
}
