import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Container = styled.div``;

const ErrorMessage = ({ errorText }) => {
  return (
    <Container>
      <span>{errorText}</span>
    </Container>
  );
};

const mapStateToProps = (state, ownProps) => {
  return { errorText: state.Error.text };
};
export default connect(mapStateToProps, null)(ErrorMessage);
