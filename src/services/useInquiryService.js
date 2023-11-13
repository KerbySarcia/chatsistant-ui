import { useCallback } from "react";
import useApiHandler from "../hooks/useApiHandler";

export default function useInquiryService() {
  const { get, put, post } = useApiHandler();

  const getAll = async params => {
    return await get("/inquiries", params);
  };

  const updateStatus = async (id, payload) => {
    return await put("/inquiries", {
      _id: id,
      status: payload.status,
      answer: payload.answer,
    });
  };

  const sendEmail = async payload => {
    return await post("/users/send-email", payload);
  };

  const getAllQuestionsCount = useCallback(async () => {
    return await get("/inquiries/inquiries");
  }, [get]);

  return {
    getAll,
    updateStatus,
    sendEmail,
    getAllQuestionsCount,
  };
}
