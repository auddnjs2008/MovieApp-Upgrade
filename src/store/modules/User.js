const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

export const userActionCreator = {
  logIn: (user) => {
    return { type: LOGIN, user: user };
  },
  logout: () => {
    return { type: LOGOUT };
  },
};

const userReducer = (state = null, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.user };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export default userReducer;
