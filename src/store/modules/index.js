import { combineReducers } from "redux";
import User from "./User";
import Error from "./Error";
import Search from "./Search";

export default combineReducers({
  User,
  Error,
  Search,
});
