const SUCCESS = "SUCCESS";
const ERROR = "ERROR";

export const errorACtionCreator = {
  success: () => ({ type: SUCCESS }),
  error: (error) => ({ type: ERROR, text: error }),
};

export default (state = "", action) => {
  switch (action.type) {
    case SUCCESS:
      return { text: "" };
    case ERROR:
      return { text: action.text };
    default:
      return state;
  }
};
