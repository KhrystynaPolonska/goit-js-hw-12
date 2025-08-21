import "./css/styles.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { getImagesByQuery } from "./js/pixabay-api.js";
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from "./js/render-functions.js";

const form = document.querySelector(".form");
const loadMoreBtn = document.querySelector(".load-more");

let query = "";
let page = 1;
let totalHits = 0; // всего для этого запроса
const perPage = 15; // держим для расчётов

form.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  query = e.currentTarget.elements["search-text"].value.trim();
  if (!query) {
    iziToast.error({ message: "Please enter a search term" });
    return;
  }

  page = 1;
  totalHits = 0;
  hideLoadMoreButton();
  clearGallery();
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.info({
        message:
          "Sorry, there are no images matching your search query. Please try again!",
      });
      return;
    }

    createGallery(data.hits);

    // показать кнопку, если есть что грузить дальше
    const loadedNow = data.hits.length;
    if (loadedNow < totalHits) showLoadMoreButton();
    else hideLoadMoreButton();
  } catch (err) {
    iziToast.error({ message: "Something went wrong while fetching images." });
    console.error(err);
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  page += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    // плавный скролл на 2 высоты карточки
    smoothScrollByTwoCards();

    // прячем кнопку на конце коллекции
    const alreadyLoaded = document.querySelectorAll(".gallery-item").length;
    if (alreadyLoaded >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (err) {
    iziToast.error({ message: "Error loading more images." });
    console.error(err);
  } finally {
    hideLoader();
  }
}

function smoothScrollByTwoCards() {
  const firstCard = document.querySelector(".gallery-item");
  if (!firstCard) return;
  const { height } = firstCard.getBoundingClientRect();

  window.scrollBy({
    top: height * 2,
    behavior: "smooth",
  });
}
