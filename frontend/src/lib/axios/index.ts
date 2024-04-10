//Libs
import axios from "axios";

//Types
import { APIResponse } from "./types";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

/**
 * Interceptor that rejects promise when response type is APIResponse<any> and status !== "success"
 * Reject message is response.message or "unknownError" when undefined
 */

axiosInstance.interceptors.response.use(
  (response) => {
    if (
      typeof response.data === "object" &&
      "status" in response.data &&
      "message" in response.data &&
      "data" in response.data
    ) {
      const apiResponse = response.data as APIResponse<any>;
      if (apiResponse.status !== "success") {
        return Promise.reject(apiResponse.message || "unknownError");
      }
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance as axios };
export * from "./types";
