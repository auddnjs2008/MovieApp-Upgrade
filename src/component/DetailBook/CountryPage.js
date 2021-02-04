import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ItemCountry = styled.section`
  position: absolute;
  top: 0;
  height: 95%;
  padding: 10px;
  h1 {
    margin-top: 30px;
    text-align: center;
    font-size: 25px;
    font-weight: 600;
    margin-bottom: 30px;
  }
  .countries {
    padding: 10px;
    display: grid;
    grid-auto-rows: 35vh;
    height: 70vh;
    overflow: auto;
    .country {
      font-size: 25px;
      line-height: 1.1;
      span {
        font-size: 19px;
        margin-left: 10px;
        padding: 5px;
        border-radius: 50%;
        background-color: rgba(64, 115, 158, 1);
        color: white;
        margin-top: 10px;
      }
    }
  }
  .backPage {
    .series {
      height: 65vh;
      overflow: auto;
      overflow-x: hidden;
      padding: 10px;
    }
    .season {
      display: flex;
      margin-bottom: 15px;
      align-items: center;
      font-size: 20px;
      &:hover {
        background-color: rgba(15, 15, 15, 0.8);
        color: white;
        transform: scale(1.05, 1.05);
      }
      transition: all 0.5s linear;
      img {
        max-width: 200px;
        max-height: 200px;
        width: auto;
        height: auto;
        margin-right: 20px;
      }
    }
  }
`;
const SeriesWrapper = styled.div`
  position: relative;
  width: 100%;
  &::after {
    width: 100%;
    height: 100%;
    background-image: ${(props) => `url(${props.src})`};
    background-size: cover;
    background-position: center center;
    border-radius: 15px;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.8;
    z-index: -1;
  }
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 17px;
  font-weight: 600;
  &:hover {
    transform: scale(1.01, 1.01);
  }
  transition: transform 0.5s linear;
  img {
    width: 100px;
    height: 130px;
  }
`;
const BackPage = styled.div`
  display: none;
`;

const CountryPage = ({ data, setSeason }) => {
  const onClick = (e) => {
    const {
      currentTarget: { id: seasonId },
    } = e;
    setSeason(seasonId);
  };

  return (
    <ItemCountry>
      <div>
        <h1>Production Countries</h1>
        <div className="countries">
          {data["results"].production_countries.length
            ? data["results"].production_countries.map((item, index) => (
                <div className="country" key={index}>
                  {item.name}
                  <span>{item.iso_3166_1}</span>
                </div>
              ))
            : ""}
        </div>
      </div>
      <BackPage className="backPage">
        <h1>Series</h1>
        <div className="series">
          {data["collections"] && data["collections"].parts.length
            ? data["collections"].parts.map((item, index) => (
                <Link
                  key={index}
                  to={`/${item.id}/movie`}
                  onClick={() => window.location.reload()}
                >
                  <SeriesWrapper
                    className="series-item"
                    src={`https://image.tmdb.org/t/p/w300${item.backdrop_path}`}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      alt=""
                    />
                    <div>{item.original_title}</div>
                  </SeriesWrapper>
                </Link>
              ))
            : data["results"].seasons
            ? data["results"].seasons.map((item, index) => (
                <div
                  key={index}
                  className="season"
                  id={item.season_number}
                  onClick={onClick}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    alt=""
                  ></img>
                  <div>{item.name}</div>
                </div>
              ))
            : ""}
        </div>
      </BackPage>
    </ItemCountry>
  );
};

export default CountryPage;

CountryPage.propTypes = {
  data: PropTypes.object,
  setSeason: PropTypes.func,
};
