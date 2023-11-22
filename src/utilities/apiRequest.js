import axios from "axios";
import { API_SERVER_URL } from "./constants";

const getRequestURL = (url) => {
  return API_SERVER_URL + url;
};
const apiResponse = async (method, url, body, headers) => {
  switch (method) {
    case "GET":
      const get_response = await axios.get(getRequestURL(url), {
        headers: { ...headers },
      });
      return get_response;
    case "POST":
      const post_response = await axios.post(getRequestURL(url), body, {
        headers: { ...headers },
      });
      return post_response;
    default:
      return { error: "Request not Found", statusCode: 500 };
  }
};

export const api_get = async (url, headers) => {
  const response = await apiResponse("GET", url, null, headers);
  return response;
};

export const api_post = async (url, body, headers) => {
  const response = await apiResponse("POST", url, body, headers);
  return response;
};
