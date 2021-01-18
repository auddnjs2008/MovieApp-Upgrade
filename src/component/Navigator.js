import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import SearchForm from "./SearchForm";

const Ul = styled.ul`
  background-color: ${(props) =>
    props.scroll !== 0 ? "rgba(20, 20, 20, 0.9)" : ""};
  background: ${(props) =>
    props.scroll === 0 ? "linear-gradient(black,rgba(0,0,0,0))" : ""};
  color: white;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  font-size: 20px;
  z-index: 10;
  position: fixed;
  top: 0;
`;
const SLink = styled(Link)`
  padding-bottom: 20px;
  border-bottom: ${(props) => (props.isroute ? "5px solid red" : "")};
`;

const Navigator = ({ location }) => {
  const route = location.pathname;
  const [scroll, setScroll] = useState(window.scrollY);

  useEffect(() => {
    window.addEventListener("scroll", () => setScroll(window.scrollY));
    return () =>
      window.removeEventListener("scroll", () => setScroll(window.scrollY));
  }, []);

  return (
    <Ul scroll={scroll}>
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
