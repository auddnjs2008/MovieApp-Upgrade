import React from "react";
import { connect } from "react-redux";
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import Auth from "../routes/Auth";
import Detail from "../routes/Detail";
import Drama from "../routes/Drama";
import Movie from "../routes/Movie";
import MyPage from "../routes/MyPage";
import Navigator from "./Navigator";

const APPRouter = ({ user }) => {
  return (
    <Router>
      {user ? <Navigator /> : ""}
      {user ? (
        <>
          <Switch>
            <Route path="/" exact>
              <Movie />
            </Route>
            <Route path="/drama">
              <Drama />
            </Route>
            <Route path="/mypage">
              <MyPage />
            </Route>
            <Route path="/:id">
              <Detail />
            </Route>
          </Switch>
        </>
      ) : (
        <Route path="/">
          {" "}
          <Auth />
        </Route>
      )}
    </Router>
  );
};

const mapStateToProps = (state, ownProps) => {
  return state.User;
};

export default connect(mapStateToProps, null)(APPRouter);
