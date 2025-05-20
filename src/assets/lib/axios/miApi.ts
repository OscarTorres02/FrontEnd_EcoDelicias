import axios from "axios";

const myApi = axios.create({
  baseURL: "https://ecodelicias.somee.com/api",
});
export default myApi;
