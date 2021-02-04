import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const HeaderImage = styled.div`
  position: relative;
  transform: ${(props) => (props.width <= 450 ? " " : "translateY(-13%)")};
  .Image {
    position: relative;
    height: 0;
    padding-bottom: 56.25%;
    iframe {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
`;
const HeaderInfo = styled.div`
  position: absolute;

  bottom: ${(props) => (props.width > 800 ? "10%" : "0")};
  left: 50px;
  color: white;
  border: ${(props) => (props.width > 600 ? "2px solid yellow" : "")};
  border-radius: 10px;
  padding: 10px;
  ${(props) => (props.width <= 600 ? "p{display:none} h1{display:none}" : "")}
  h1 {
    font-size: 30px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  p {
    margin-bottom: 20px;
    width: 200px;
  }
  button {
    all: unset;
    padding: 10px;
    border-radius: 5px;
    background-color: rgba(149, 165, 166, 0.5);
  }
`;
const SLink = styled(Link)``;

const HeaderPoster = ({ video, data, width, type }) => {
  return (
    <HeaderImage width={width}>
      {video.length !== 0 ? (
        <div className="Image">
          <iframe
            title={video[0].key}
            src={`https://www.youtube.com/embed/${video[0].key}?vq=hd720&autoplay=1&mute=1&amp;loop=1;playlist=${video[0].key}`}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <img
          alt=""
          src={
            data.poster_path
              ? `https://image.tmdb.org/t/p/w300${data.poster_path}`
              : "https://usecloud.s3-ap-northeast-1.amazonaws.com/kakaoMapIcon/movie.jpg"
          }
        ></img>
      )}
      <HeaderInfo width={width}>
        <h1>{data.original_title}</h1>
        <p>
          {data.overview.length < 110
            ? data.overview
            : data.overview.substring(0, 110) + "..."}
        </p>
        <SLink id={data.id} to={`/${data.id}/${type}`}>
          <button>상세정보</button>
        </SLink>
      </HeaderInfo>
    </HeaderImage>
  );
};

export default HeaderPoster;

HeaderPoster.propTypes = {
  video: PropTypes.array,
  data: PropTypes.object,
  width: PropTypes.number,
  type: PropTypes.string,
};
