const SUCCESS = "SUCCESS";
const ERROR = "ERROR";

export const errorACtionCreator = {
  success: () => ({ type: SUCCESS }),
  error: (error) => ({ type: ERROR, text: error }),
};

const errorReducer = (state = "", action) => {
  switch (action.type) {
    case SUCCESS:
      return { text: "" };
    case ERROR:
      return { text: action.text };
    default:
      return state;
  }
};

export default errorReducer;
