import { useCallback } from "react";
import useApiHandler from "../hooks/useApiHandler";

export default function useKnowledege() {
  const { post, get } = useApiHandler();

  const addKnowledge = useCallback(
    async (payload) => {
      return await post("/knowledges", payload);
    },
    [post]
  );

  const getKnowledges = useCallback(async () => {
    return await get("/knowledges");
  }, [get]);

  return {
    addKnowledge,
    getKnowledges,
  };
}
