const SEARCH = "SEARCH";
const NOSEARCH = "NOSEARCH";

export const searchActionCreator = {
  search: (text) => ({ type: SEARCH, text }),
  noSearch: () => ({ type: NOSEARCH, text: "" }),
};

export default (state = "", action) => {
  switch (action.type) {
    case SEARCH:
      return action.text;
    case NOSEARCH:
      return action.text;
    default:
      return state;
  }
};
