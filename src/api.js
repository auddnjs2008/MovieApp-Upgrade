import axios from "axios";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  params: {
    api_key: "0660681ed36a895a19653f0a4317e292",
    language: "en-US",
  },
});

// movie  - latest, popular, nowp playin, up coming

export const moviesApi = {
  latest: () => api.get("movie/latest"),
  nowPlaying: () => api.get("movie/now_playing"),
  popular: () => api.get("movie/popular"),
  upComing: () => api.get("movie/upcoming"),
  detail: (id) =>
    api.get(`movie/${id}`, {
      params: {
        append_to_response: "videos",
      },
    }),
  search: (term) =>
    api.get(`search/movie`, {
      params: {
        query: encodeURIComponent(term),
      },
    }),
  videos: (id) => api.get(`movie/${id}/videos`),
  images: (id) => api.get(`movie/${id}/images`),
  peoples: (id) => api.get(`movie/${id}/credits`),
  reviews: (id) => api.get(`movie/${id}/reviews`),
  similar: (id) => api.get(`movie/${id}/similar`),
  collection: (id) => api.get(`collection/${id}`),
};

//drama -Latest, popular, on_the_air

export const dramaApi = {
  lates: () => api.get("tv/latest"),
  popular: () => api.get("tv/popular"),
  onAir: () => api.get("tv/on_the_air"),
  topRated: () => api.get("tv/top_rated"),
  detail: (id) =>
    api.get(`tv/${id}`, {
      params: {
        append_to_response: "videos",
      },
    }),
  search: (term) =>
    api.get(`search/tv`, {
      params: {
        query: encodeURIComponent(term),
      },
    }),
  videos: (id) => api.get(`tv/${id}/videos`),
  images: (id) => api.get(`tv/${id}/images`),
  peoples: (id) => api.get(`tv/${id}/credits`),
  reviews: (id) => api.get(`tv/${id}/reviews`),
  similar: (id) => api.get(`tv/${id}/similar`),
};

export const actorApi = (id) => api.get(`/credit/${id}`);

export default api;
