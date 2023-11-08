import useApiHandler from "../hooks/useApiHandler";

export default function useAuthService() {
  const { post, get } = useApiHandler();

  const login = async payload => {
    return await post("/auth/login", payload);
  };

  const singUp = async payload => {
    return await post("/users", payload);
  };

  const verifyAuth = async () => {
    return await get("/users/me");
  };

  return {
    login,
    singUp,
    verifyAuth,
  };
}
