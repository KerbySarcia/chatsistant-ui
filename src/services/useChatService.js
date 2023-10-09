import { useCallback } from "react";
import useApiHandler from "../hooks/useApiHandler";

export default function useChatService() {
  const { get, post, put } = useApiHandler();

  const getConversations = useCallback(async () => {
    return await get("/conversations");
  }, [get]);

  const sendQuestion = useCallback(
    async (payload) => {
      return await post("/knowledges/ask", payload);
    },
    [post]
  );

  const getConversation = useCallback(
    async (id) => {
      return await get(`/conversations/${id}`);
    },
    [get]
  );

  const updateConversation = useCallback(
    async (id, payload) => {
      return await put(`/conversations/${id}`, payload);
    },
    [put]
  );

  const addMessage = useCallback(
    async (payload) => {
      return await post("/conversations", payload);
    },
    [post]
  );

  return {
    getConversations,
    sendQuestion,
    getConversation,
    updateConversation,
    addMessage,
  };
}
