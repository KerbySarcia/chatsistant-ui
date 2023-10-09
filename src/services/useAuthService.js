import useApiHandler from "../hooks/useApiHandler";

export default function useAuthService() {
  const { post } = useApiHandler();

  const login = async (payload) => {
    return await post("/auth/login", payload);
  };

  const singUp = async (payload) => {
    return await post("/users", payload);
  };

  return {
    login,
    singUp,
  };
}
