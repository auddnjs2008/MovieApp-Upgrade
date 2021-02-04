import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const ItemEnd = styled.section`
  position: absolute;
  top: 0;
  height: 95%;

  background-image: ${(props) => `url(${props.src})`};
  background-size: contain;
  background-position: center center;
  display: flex;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 50px;
    font-weight: 600;
    color: white;
    text-shadow: 5px 2px 2px black;
  }
`;
const BackPage = styled.div`
  display: none;
`;

const EndPage = ({ data }) => {
  return (
    <ItemEnd src={`https://image.tmdb.org/t/p/w300${data.poster_path}`}>
      <h1>Thank you</h1>
      <BackPage className="backPage">
        <h1>The End</h1>
      </BackPage>
    </ItemEnd>
  );
};

export default EndPage;

EndPage.propTypes = {
  data: PropTypes.object,
};
