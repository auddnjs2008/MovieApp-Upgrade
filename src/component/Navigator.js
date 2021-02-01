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
  //display: ${(props) => (props.width >= 960 ? "flex" : "block")};
  display: grid;
  grid-template-columns: repeat(4, minmax(70px, 1fr));

  justify-items: center;
  align-items: center;
  font-size: ${(props) => (props.width > 450 ? "20px" : "15px")};
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
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("scroll", () => setScroll(window.scrollY));
    window.addEventListener("resize", () => setWidth(window.innerWidth));
    return () => {
      window.removeEventListener("scroll", () => setScroll(window.scrollY));
      window.removeEventListener("resize", () => setWidth(window.innerWidth));
    };
  }, []);

  return (
    <Ul scroll={scroll} width={width}>
      <SLink to="/" isroute={route === "/" ? 1 : 0}>
        Movie
      </SLink>
      <SLink to="/drama" isroute={route === "/drama" ? 1 : 0}>
        Drama
      </SLink>
      <SLink to="/mypage" isroute={route === "/mypage" ? 1 : 0}>
        MyPage
      </SLink>
      <SearchForm width={width}></SearchForm>
    </Ul>
  );
};

export default withRouter(Navigator);
