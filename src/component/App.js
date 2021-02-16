import APPRouter from "./Router";
import GlobalStyle from "./GlobalStyle";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { authService } from "../fbase";
import { connect } from "react-redux";
import { userActionCreator } from "../store/modules/User";

function App({ logIn, logOut }) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        logIn(user);
      } else {
        logOut();
      }
      setInit(true);
    });
  }, [logIn, logOut]);

  return (
    <>
      {init ? <APPRouter /> : "Loading..."}
      <GlobalStyle />
    </>
  );
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logIn: (user) => dispatch(userActionCreator.logIn(user)),
    logOut: () => dispatch(userActionCreator.logout()),
  };
};

export default connect(null, mapDispatchToProps)(App);

App.propTypes = {
  logIn: PropTypes.func,
  logOut: PropTypes.func,
};
