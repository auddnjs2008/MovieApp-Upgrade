import React from "react";
import { connect } from "react-redux";
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Auth from "../routes/Auth";
import Drama from "../routes/Drama";
import Movie from "../routes/Movie";
import MyPage from "../routes/MyPage";
import Search from "../routes/Search";
import Navigator from "./Navigator";

const APPRouter = ({ user }) => {
  return (
    <Router>
      {user ? <Navigator /> : ""}
      <>
        <Route path="/" exact>
          {user ? <Movie /> : <Auth />}
        </Route>
        <Route path="/drama">
          <Drama />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
        <Route path="/mypage">
          <MyPage />
        </Route>
      </>
    </Router>
  );
};

const mapStateToProps = (state, ownProps) => {
  return { user: state.User };
};

export default connect(mapStateToProps, null)(APPRouter);
