import axios from "axios";

export const BASE_URL = "https://proconnect-linkdinclone.onrender.com/"

const clientServer = axios.create({
  baseURL: BASE_URL,
});

export default clientServer;
