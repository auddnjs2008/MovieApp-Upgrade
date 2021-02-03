import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { dramaApi } from "../api";

const Container = styled.div`
  color: white;
  width: 100%;
  height: 100%;

  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  background-color: rgba(16, 16, 16, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
`;
const ContentWrapper = styled.div`
  position: relative;

  width: ${(props) => (props.width < 700 ? "90%" : "50%")};
  height: 100%;
  border-radius: 10px;
  margin-top: 100px;
`;
const Profile = styled.div`
  .episodeHeader {
    display: grid;
    grid-template-columns: 3fr 1fr;
    gap: 5px;
    align-items: center;
    justify-items: center;
    background-color: #2d3436;
    font-size: 30px;
    box-shadow: 0px 5px 4px black;
    margin-bottom: 20px;
    img {
      justify-self: start;
      max-width: 100%;
      object-fit: cover;
    }
    div {
      justify-self: start;
    }
  }
`;

const Episode = styled.div`
  display: grid;

  grid-template-columns: ${(props) =>
    props.width < 500 ? "1fr 2fr 3fr" : "1fr 3fr 3fr"};
  grid-template-rows: ${(props) => (props.width < 500 ? "180px" : "150px")};
  align-items: center;
  gap: 20px;
  padding: 10px;
  background-color: #2d3436;
  border-bottom: 1px solid black;
  h1 {
    font-size: 20px;
    margin-left: 10px;
  }
  img {
    max-width: 100%;
    object-fit: cover;
  }
  .episode-info {
    h2 {
      margin-bottom: 5px;
      font-size: 18px;
      font-weight: 600;
    }
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  border-radius: 50%;
  border: none;
  outline: none;
  width: 30px;
  height: 30px;
  font-size: 20px;
  top: 10px;
  right: 10px;
  &:active {
    transform: scale(1.05, 1.05);
  }
`;
const SeasonBox = ({ width, season, setSeason, id }) => {
  const [data, setData] = useState(null);

  const closeBtn = () => {
    setData(null);
    setSeason(null);
  };

  const getData = async () => {
    if (season !== "") {
      const newData = await dramaApi.seasons(id, season);
      setData(newData.data);
    }
  };

  useEffect(() => {
    getData();
  }, [season]);

  return data ? (
    <Container className="infowindow" width={width}>
      <ContentWrapper width={width}>
        <Profile>
          <div className="episodeHeader">
            <img src={`https://image.tmdb.org/t/p/w300${data.poster_path}`} />
            <div>{data.name}</div>
          </div>
          {data.episodes.map((item) => (
            <Episode className="episode" width={width}>
              <h1>{item.episode_number}</h1>
              <img
                src={
                  item.still_path
                    ? `https://image.tmdb.org/t/p/w300${item.still_path}`
                    : "https://usecloud.s3-ap-northeast-1.amazonaws.com/kakaoMapIcon/movie.jpg"
                }
              />
              <div className="episode-info">
                <h2>{item.name}</h2>
                <p>
                  {item.overview.length > 100
                    ? item.overview.substring(0, 100) + "..."
                    : item.overview}
                </p>
              </div>
            </Episode>
          ))}
        </Profile>
        <CloseBtn onClick={closeBtn}>✖</CloseBtn>
      </ContentWrapper>
    </Container>
  ) : (
    ""
  );
};

export default SeasonBox;

SeasonBox.propTypes = {
  width: PropTypes.number,
  season: PropTypes.string,
  setSeason: PropTypes.func,
  id: PropTypes.string,
};
