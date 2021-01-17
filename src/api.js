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
  detail: (id) => api.get(`movie/${id}`),
  search: (term) =>
    api.get(`search/movie`, {
      params: {
        query: encodeURIComponent(term),
      },
    }),
  videos: (id) => api.get(`movie/${id}/videos`),
};

//drama -Latest, popular, on_the_air

export const dramaApi = {
  lates: () => api.get("tv/latest"),
  popular: () => api.get("tv/popular"),
  onAir: () => api.get("tv/on_the_air"),
  airToday: () => api.get("tv/airing_today"),
  detail: (id) => api.get(`tv/${id}`),
  search: (term) =>
    api.get(`search/tv`, {
      params: {
        query: encodeURIComponent(term),
      },
    }),
  videos: (id) => api.get(`tv/${id}/videos`),
};

export default api;
