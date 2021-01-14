import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Ul = styled.ul``;

const Navigator = () => {
  return (
    <Ul>
      <Link to="/">Movie</Link>
      <Link to="/drama">Drama</Link>
      <Link to="/search">Search</Link>
      <Link to="/mypage">MyPage</Link>
    </Ul>
  );
};

export default Navigator;
