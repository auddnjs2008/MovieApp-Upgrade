import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { moviesApi } from "../api";

import SearchPage from "../component/SearchPage";

import { connect } from "react-redux";
import { myListActionCreator } from "../store/modules/MyList";
import { storeService } from "../fbase";
import { queryAllByAttribute } from "@testing-library/react";
import { Link } from "react-router-dom";
import PosterSlider from "../component/PosterSlider";

const Container = styled.div`
  width: 100%;
`;
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

const ContentWrapper = styled.div`
  div.hoverBox {
    background-color: rgba(20, 20, 20, 1);
    border-radius: 20px;
    width: 100px;
    height: 130px;
    color: white;
    div.videoWrapper {
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
    transform: translate(-25%, -25%);
    @keyframes hoverMove {
      0% {
        transform: scale(1, 1);
      }
      100% {
        transform: scale(3, 2);
      }
    }

    animation: hoverMove 0.2s linear forwards;

    h4 {
      padding: 10px;
      color: white;
      font-size: 3px;
      text-align: center;
      margin: 5px 0px;
      // padding: 10px;
    }
    div {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 10px;
        height: 10px;
        border: none;
        outline: none;
        color: white;
        background-color: rgba(64, 115, 158, 1);
        border-radius: 5px;
        &:active {
          transform: scale(0.98, 0.98);
        }
      }
      a {
        font-size: 10px;
        border: 1px solid rgba(64, 115, 158, 1);
        padding: 3px;
        border-radius: 5px;
        cursor: pointer;
        &:active {
          transform: scale(0.99, 0.99);
        }
      }
    }
  }
`;
const SectionWrapper = styled.section`
  position: relative;

  margin-bottom: 50px;
  padding: 10px;
  h1 {
    color: white;
    font-size: 25px;
    margin-bottom: 20px;
  }
  &:hover {
    div#left,
    div#right {
      opacity: 1;
    }
  }
`;

const SLink = styled(Link)``;

const Movie = ({ MyList, bunchPush, uid }) => {
  const [data, setData] = useState({}); // popular, nowPlaying upComing  -> data.results에 존재
  const [width, setWidth] = useState(window.innerWidth);

  const [isMobile, setMobile] = useState(
    /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)
  );

  const findData = async () => {
    let testArray = [];
    const test = await storeService
      .collection(`mwFlix-${uid}`)
      .get(queryAllByAttribute);

    test.forEach((item) =>
      testArray.push({
        id: parseInt(item.data().id),
        content: item.data().type,
      })
    );

    bunchPush(testArray);
  };

  const getData = async () => {
    const {
      data: { results: popular },
    } = await moviesApi.popular();

    const {
      data: { results: nowPlaying },
    } = await moviesApi.nowPlaying();

    const {
      data: { results: upComing },
    } = await moviesApi.upComing();

    const Random = Math.floor(Math.random() * (nowPlaying.length - 1)) + 1;
    const latestVideo = (
      await moviesApi.videos(parseInt(nowPlaying[Random].id))
    ).data.results;
    const latest = nowPlaying[Random];

    setData({ popular, nowPlaying, upComing, latest, latestVideo });
  };

  useEffect(() => {
    if (!MyList.length) findData(); // 처음 로그인하고  화면들어올때만  셋팅을 해준다.
  }, []);

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));

    return () =>
      window.removeEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  useEffect(() => {
    getData();
  }, []);

  // 포스터 위에 마우스를 올렸을때  영상이 재생되게 하는 함수 필요(영상데이터를 가져와야 한다.

  return Object.keys(data).length !== 0 ? (
    <Container>
      <HeaderImage width={width}>
        {data["latestVideo"]?.length !== 0 ? (
          <div className="Image">
            <iframe
              src={`https://www.youtube.com/embed/${data["latestVideo"][0].key}?vq=hd720&autoplay=1&mute=1&amp;loop=1;playlist=${data["latestVideo"][0].key}`}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <img
            src={
              data["latest"].poster_path
                ? `https://image.tmdb.org/t/p/w300${data["latest"].poster_path}`
                : "https://usecloud.s3-ap-northeast-1.amazonaws.com/kakaoMapIcon/movie.jpg"
            }
          ></img>
        )}
        <HeaderInfo width={width}>
          <h1>{data["latest"].original_title}</h1>
          <p>
            {data["latest"].overview.length < 110
              ? data["latest"].overview
              : data["latest"].overview.substring(0, 110) + "..."}
          </p>
          <SLink id={data["latest"].id} to={`/${data["latest"].id}/movie`}>
            <button>상세정보</button>
          </SLink>
        </HeaderInfo>
      </HeaderImage>

      <ContentWrapper className="content">
        <SectionWrapper>
          <h1>Popular Movie</h1>
          <PosterSlider
            data={data["popular"]}
            isMobile={isMobile}
            type={"movie"}
          ></PosterSlider>
        </SectionWrapper>
        <SectionWrapper>
          <h1>Now Playing</h1>
          <PosterSlider
            data={data["nowPlaying"]}
            isMobile={isMobile}
            type={"movie"}
          ></PosterSlider>
        </SectionWrapper>
        <SectionWrapper>
          <h1>UpComing</h1>
          <PosterSlider
            data={data["upComing"]}
            isMobile={isMobile}
            type={"movie"}
          ></PosterSlider>
        </SectionWrapper>
      </ContentWrapper>
      <SearchPage></SearchPage>
    </Container>
  ) : (
    "Loading.."
  );
};
const mapStateToProps = (state, ownProps) => {
  return { MyList: state.MyList, uid: state.User.user.uid };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    bunchPush: (data) => dispatch(myListActionCreator.dataBunchPush(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Movie);

Movie.propTypes = {
  MyList: PropTypes.array,
  bunchPush: PropTypes.func,
  uid: PropTypes.string,
};
