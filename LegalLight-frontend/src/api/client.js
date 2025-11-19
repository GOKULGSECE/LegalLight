import axios from "axios";

const BASE_URL = "http://192.168.56.1:8080/api"; 

export async function searchGet(query) {
  try {
    const response = await axios.get(`${BASE_URL}/search?query=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
