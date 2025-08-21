import axios from "axios";

const API_KEY = "25786434-348adb767e319176b4ad356ea"; // твой ключ
const BASE_URL = "https://pixabay.com/api/";

/**
 * Выполняет HTTP-запрос на Pixabay и возвращает response.data
 * @param {string} query - поисковая строка
 * @param {number} page  - номер страницы
 * @returns {Promise<{hits:Array, totalHits:number}>}
 */
export async function getImagesByQuery(query, page = 1) {
  const params = {
    key: API_KEY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
    page,
    per_page: 15, // требование ТЗ
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
}
