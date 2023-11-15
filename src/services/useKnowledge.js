import { useCallback } from "react";
import useApiHandler from "../hooks/useApiHandler";
import { pick } from "lodash";

export default function useKnowledege() {
  const { post, get, deleteData, put } = useApiHandler();

  const addKnowledge = useCallback(
    async payload => {
      return await post("/knowledges", payload);
    },
    [post]
  );

  const getKnowledges = useCallback(
    async payload => {
      return await get("/knowledges", payload);
    },
    [get]
  );

  const updateKnowledge = useCallback(
    async payload => {
      return await put(`/knowledges/${payload._id}`, {
        knowledge: pick(payload, ["subject", "target", "value"]),
      });
    },
    [put]
  );

  const deleteKnowledge = useCallback(
    async id => {
      return await deleteData(`/knowledges/${id}`);
    },
    [deleteData]
  );

  const getSubjects = useCallback(async () => {
    return await get("/knowledges/subject");
  }, [get]);

  const getTargets = useCallback(async () => {
    return await get("/knowledges/target");
  }, [get]);

  return {
    addKnowledge,
    getKnowledges,
    deleteKnowledge,
    updateKnowledge,
    getSubjects,
    getTargets,
  };
}
