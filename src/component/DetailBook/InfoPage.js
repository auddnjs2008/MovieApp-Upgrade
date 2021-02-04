import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ItemInfo = styled.section`
  position: absolute;
  top: 0;
  //width: 47%;
  height: 95%;
  .info {
    width: 100%;
    height: 100%;
    h1 {
      margin-top: 15px;

      text-align: center;
      font-size: 25px;
      font-weight: 600;
    }
    p {
      margin-top: 20px;
      padding: 20px;
      line-height: 1.5;
      color: white;
      width: 100%;
      height: 80%;
      background-color: rgba(64, 115, 158, 1);
    }
  }
  .backPage {
    h1 {
      margin-top: 15px;
      text-align: center;
      font-size: 25px;
      font-weight: 600;
    }
  }
`;
const VideoWrapper = styled.div`
  //display: flex;

  margin-top: 30px;
  //transform: translateY(-50%);
  overflow: auto;
  padding: 5px;
  height: 55vh;
  .videoBox {
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
  .noVideos {
    margin: 0 auto;
    position: relative;

    width: 200px;
    img {
      max-width: 200px;
      max-height: 200px;
      object-fit: contain;
    }
    div {
      position: absolute;
      top: 0;
      left: 120px;
      border: 1px solid black;
      background-color: rgba(64, 115, 158, 1);
      color: white;
      border-radius: 20px;
      border-bottom-left-radius: 0;
      width: 200px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;
const BackPage = styled.div`
  display: none;
`;

const InfoPage = ({ data }) => {
  return (
    <ItemInfo
      src={`https://image.tmdb.org/t/p/w300${data["results"].poster_path}`}
    >
      <div className="info">
        <h1>OverView</h1>
        <p>{data["results"].overview}</p>
      </div>
      <BackPage className="backPage">
        <h1>Videos</h1>
        <VideoWrapper>
          {data.results.videos.results.length !== 0 ? (
            data.results.videos.results.map((item, index) => (
              <div className="videoBox" key={index}>
                <iframe
                  title={item.key}
                  src={`https://www.youtube.com/embed/${item.key}?ps=blogger&showinfo=0&cc_load_policy=0&iv_load_policy=3&vq=hd720&rel=0&fs=0&amp;loop=1;playlist=${item.key}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ))
          ) : (
            <div className="noVideos">
              <img
                src="https://usecloud.s3-ap-northeast-1.amazonaws.com/%EC%96%B4%EB%AA%BD%EC%96%B4%EC%8A%A42.PNG"
                alt=""
              />
              <div>There are no Videos</div>
            </div>
          )}
        </VideoWrapper>
      </BackPage>
    </ItemInfo>
  );
};

export default InfoPage;

InfoPage.propTypes = {
  data: PropTypes.object,
};
