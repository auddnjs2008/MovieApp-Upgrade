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
import { useEffect } from "react";

const Container = styled.div`
  padding: 20px;

  display: grid;
  grid-template-rows: 80px 220px 1fr 120px 50px;
  justify-items: center;
  align-items: center;
  align-items: center;
  h1 {
    color: rgba(229, 80, 57, 1);
    font-size: 50px;
    margin-bottom: 40px;
  }
  img {
    width: 200px;
    height: 200px;
    background-color: rgba(229, 80, 57, 1);
    margin-bottom: 40px;
  }
  input:not(input[type="submit"]) {
    height: 50px;
    border: none;
    outline: none;
    font-size: 20px;
    margin-right: 5px;
    &::placeholder {
      font-size: 20px;
    }
  }

  input[type="email"] {
    grid-area: email;
  }
  input[type="password"] {
    grid-area: password;
  }
  input[type="submit"] {
    height: 50px;
    font-size: 20px;
    border: none;
    outline: none;
    color: white;
    background-color: rgba(64, 115, 158, 1);
    grid-area: submit;
  }
  button {
    width: 300px;
    border-radius: 0;
    height: 50px;
    font-size: 20px;
    grid-area: toggle;
    justify-self: center;
  }
`;

const Form = styled.form`
  display: grid;
  row-gap: 5px;
  grid-template: ${(props) =>
    props.width > 620
      ? " 'email password submit' 1fr 'toggle toggle toggle' 1fr / 1fr 1fr 1fr "
      : "'email' 1fr 'password' 1fr 'submit' 1fr 'toggle' 1fr /1fr  "};
`;

const Auth = ({ errorMessage, successMessage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [create, setCreate] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
    return () =>
      window.removeEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

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
      <h1>MWFlix</h1>
      <img src="https://usecloud.s3-ap-northeast-1.amazonaws.com/%EC%96%B4%EB%AA%BD%EC%96%B4%EC%8A%A42.PNG" />
      <Form onSubmit={onSubmit} width={width}>
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
      <SocialLogin></SocialLogin>
      <ErrorMessage></ErrorMessage>
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

Auth.propTypes = {
  errorMessage: PropTypes.func,
  successMessage: PropTypes.func,
};
