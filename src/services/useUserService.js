import { useCallback } from "react";
import useApiHandler from "../hooks/useApiHandler";
import { pick } from "lodash";

export default function useUserService() {
  const { get, deleteData, put } = useApiHandler();

  const getUsers = useCallback(async () => {
    return await get("/users");
  }, [get]);

  const deleteUser = useCallback(
    async id => {
      return await deleteData(`/users/${id}`);
    },
    [deleteData]
  );

  const updateUser = useCallback(
    async (id, payload) => {
      return await put(
        `/users/${id}`,
        pick(payload, ["first_name", "last_name", "password", "email"])
      );
    },
    [put]
  );

  const forgotPassword = useCallback(
    async payload => {
      return await put("/users", payload);
    },
    [put]
  );

  const emailCheck = useCallback(
    async payload => {
      return await put("/users/email/email-checker", payload);
    },
    [put]
  );

  return {
    getUsers,
    deleteUser,
    updateUser,
    forgotPassword,
    emailCheck,
  };
}
