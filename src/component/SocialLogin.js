import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { authService, firebaseInit } from "../fbase";
import { connect } from "react-redux";
import { userActionCreator } from "../store/modules/User";
import { errorACtionCreator } from "../store/modules/Error";

const Container = styled.div`
  width: 300px;
  button {
    background-color: rgba(60, 99, 130, 1);
  }
`;

const SocialLogin = ({ logIn, errorMessage }) => {
  const onClick = async (e) => {
    let provider;
    let user;
    const {
      target: { name },
    } = e;
    try {
      if (name === "google") {
        provider = new firebaseInit.auth.GoogleAuthProvider();
        user = await authService.signInWithPopup(provider);
      } else if (name === "guest") {
        user = await authService.signInAnonymously();
      }
      logIn(user);
    } catch (error) {
      errorMessage(error.message);
    }
  };

  return (
    <Container>
      <button name="google" onClick={onClick}>
        Google Login
      </button>
    </Container>
  );
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logIn: (user) => dispatch(userActionCreator.logIn(user)),
    errorMessage: (text) => dispatch(errorACtionCreator.error(text)),
  };
};

export default connect(null, mapDispatchToProps)(SocialLogin);

SocialLogin.propTypes = {
  logIn: PropTypes.func,
  errorMessage: PropTypes.func,
};
