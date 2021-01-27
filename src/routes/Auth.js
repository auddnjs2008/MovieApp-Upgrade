import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { authService } from "../fbase";
import { connect } from "react-redux";
import { userActionCreator } from "../store/modules/User";
import { errorACtionCreator } from "../store/modules/Error";
import SocialLogin from "../component/SocialLogin";
import ErrorMessage from "../component/ErrorMessage";
import { myListActionCreator } from "../store/modules/MyList";

const Container = styled.div``;

const Form = styled.form``;

const Auth = ({ errorMessage, successMessage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [create, setCreate] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    let user;
    try {
      if (!create) {
        // 로그인 처리해줘야 한다.
        user = await authService.signInWithEmailAndPassword(email, password);
      } else if (create) {
        // 만들어주는 처리 해줘야 한다.
        user = await authService.createUserWithEmailAndPassword(
          email,
          password
        );
      }
      successMessage();

      // state update가 필요하다.
    } catch (error) {
      errorMessage(error.message);
    }

    setEmail("");
    setPassword("");
  };

  const onChange = (e) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  };

  const toggleBtn = (e) => {
    e.preventDefault();
    setCreate((prev) => !prev);
  };

  return (
    <Container>
      <Form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={onChange}
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={!create ? "Log In" : "Create"} />
        <button onClick={toggleBtn}>{!create ? "Create" : "Sign In"}</button>
      </Form>
      <ErrorMessage></ErrorMessage>
      <SocialLogin></SocialLogin>
    </Container>
  );
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    errorMessage: (text) => dispatch(errorACtionCreator.error(text)),
    successMessage: () => dispatch(errorACtionCreator.success()),
  };
};
export default connect(null, mapDispatchToProps)(Auth);
