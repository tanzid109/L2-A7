import { ofetch } from "ofetch";

const apiClient = ofetch.create({
  baseURL: "/api/v1",
  credentials: "include",
});

export default apiClient;