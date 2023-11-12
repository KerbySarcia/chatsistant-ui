import axios from "axios";
import Cookies from "js-cookie";
import { useCallback } from "react";

const baseURL = import.meta.env.VITE_APP_API_URL;

const useApiHandler = () => {
  const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const getAuthHeaders = useCallback(() => {
    const headers = {};
    const authToken = Cookies.get("session");
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
    return headers;
  }, []);

  const get = useCallback(
    async (url, params) => {
      const requestQuery = new URLSearchParams(params);
      const headers = getAuthHeaders();
      const response = await axiosInstance.get(
        `${url}?${requestQuery.toString()}`,
        { headers }
      );
      return response.data;
    },
    [getAuthHeaders, axiosInstance]
  );

  const post = useCallback(
    async (url, payload) => {
      let data = {};
      let error = {};
      try {
        const headers = getAuthHeaders();
        data = (await axiosInstance.post(url, payload, { headers })).data;
      } catch (err) {
        error = err.response.data;
      }
      return { data, error };
    },
    [getAuthHeaders, axiosInstance]
  );

  const put = useCallback(
    async (url, data) => {
      const headers = getAuthHeaders();
      const response = await axiosInstance.put(url, data, { headers });
      return response.data;
    },
    [getAuthHeaders, axiosInstance]
  );

  const deleteData = useCallback(
    async (url, data = {}) => {
      const headers = getAuthHeaders();
      const response = await axiosInstance.delete(url, data, { headers });
      return response.data;
    },
    [getAuthHeaders, axiosInstance]
  );

  return {
    post,
    get,
    put,
    deleteData,
  };
};

export default useApiHandler;
