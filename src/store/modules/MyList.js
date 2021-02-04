const POP = "POP";
const PUSH = "PUSH";
const BUNCHPUSH = "BUNCHPUSH";

export const myListActionCreator = {
  dataPop: (id) => ({ type: POP, id }),
  dataPush: (id, content) => ({ type: PUSH, id, content }),
  dataBunchPush: (data) => ({ type: BUNCHPUSH, data }), // data엔 배열이 들어온다.
};

const listReducer = (state = [], action) => {
  switch (action.type) {
    case PUSH:
      return [{ id: action.id, content: action.content }, ...state];
    case POP:
      return state.filter((item) => item.id !== action.id);
    case BUNCHPUSH:
      return [...action.data, ...state];
    default:
      return state;
  }
};

export default listReducer;
