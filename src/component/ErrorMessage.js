import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { errorACtionCreator } from "../store/modules/Error";

const Container = styled.div`
  position: absolute;
  bottom: ${(props) => `-${props.scroll}px`};
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 50px;
  padding: 10px;
  border-radius: 10px;
  background-color: #fc5c65;
  font-size: 20px;
  font-weight: 600;
  color: white;
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  @keyframes message {
    0% {
      opacity: 1;
      transform: translate(-50%, 100%);
    }
    50% {
      opacity: 1;
      transform: translate(-50%, -80%);
    }
    90% {
      opacity: 1;
      transform: translate(-50%, -80%);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, 100%);
    }
  }
  animation: message 2s linear;
`;

const ErrorMessage = ({ errorText, clearError }) => {
  const [scroll, setScroll] = useState(window.scrollY);
  useEffect(() => {
    if (errorText !== "") {
      setTimeout(() => clearError(), 2000);
    }
  }, [errorText]);

  useEffect(() => {
    window.addEventListener("scroll", () => setScroll(window.scrollY));
    return () =>
      window.removeEventListener("scroll", () => setScroll(window.scrollY));
  }, []);

  return errorText !== "" && errorText ? (
    <Container scroll={scroll}>
      <span>{errorText}</span>
    </Container>
  ) : (
    ""
  );
};

const mapStateToProps = (state, ownProps) => {
  return { errorText: state.Error.text };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return { clearError: () => dispatch(errorACtionCreator.success()) };
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorMessage);

ErrorMessage.propTypes = {
  errorText: PropTypes.string,
};
