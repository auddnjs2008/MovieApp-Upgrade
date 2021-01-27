import { combineReducers } from "redux";
import User from "./User";
import Error from "./Error";
import Search from "./Search";
import MyList from "./MyList";
export default combineReducers({
  User,
  Error,
  Search,
  MyList,
});
