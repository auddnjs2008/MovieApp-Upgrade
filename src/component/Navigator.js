import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import SearchForm from "./SearchForm";

const Ul = styled.ul`
  background-color: rgba(20, 20, 20, 0.9);
  color: white;
  width: 100%;
  height: 60px;
  display: flex;
`;
const SLink = styled(Link)`
  border-bottom: ${(props) => (props.isroute ? "5px solid red" : "")};
`;

const Navigator = ({ location }) => {
  const route = location.pathname;
  return (
    <Ul>
      <SLink to="/" isroute={route === "/" ? 1 : 0}>
        Movie
      </SLink>
      <SLink to="/drama" isroute={route === "/drama" ? 1 : 0}>
        Drama
      </SLink>
      <SLink to="/mypage" isroute={route === "/mypage" ? 1 : 0}>
        MyPage
      </SLink>
      <SearchForm></SearchForm>
    </Ul>
  );
};

export default withRouter(Navigator);
