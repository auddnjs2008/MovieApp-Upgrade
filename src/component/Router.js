import React, { useEffect } from "react";
import { connect } from "react-redux";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Actor from "../routes/Actor";
import Auth from "../routes/Auth";
import Detail from "../routes/Detail";
import Drama from "../routes/Drama";
import Movie from "../routes/Movie";
import MyPage from "../routes/MyPage";
import ErrorMessage from "./ErrorMessage";
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
            <Route path="/actor/:id">
              <Actor />
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
      <ErrorMessage></ErrorMessage>
    </Router>
  );
};

const mapStateToProps = (state, ownProps) => {
  return state.User;
};

export default connect(mapStateToProps, null)(APPRouter);
