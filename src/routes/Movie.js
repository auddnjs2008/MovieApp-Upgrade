import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { moviesApi } from "../api";
import { Link } from "react-router-dom";
import SearchPage from "../component/SearchPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  width: 100%;
`;
const HeaderImage = styled.div`
  position: relative;
  transform: translateY(-13%);
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
  top: ${(props) => (props.width > 800 ? "50%" : "10%")};
  left: 50px;
  color: white;
  border: 2px solid yellow;
  border-radius: 10px;
  padding: 10px;
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

const ContentWrapper = styled.div``;
const SectionWrapper = styled.section`
  position: relative;
  h1 {
    color: white;
    font-size: 25px;
    margin-bottom: 10px;
  }
`;
const MoviesWrapper = styled.div`
  display: flex;
  width: 99vw;
  overflow: auto;
  &::-webkit-scrollbar {
    //display: none;
  }
  img {
    width: 100px;
    height: 130px;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  &#left,
  &#right {
    top: 35px;
    height: 130px;
    width: 30px;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
  }
  &#right {
    right: 0;
  }
`;
const MovieWrapper = styled.div`
  position: relative;
  margin-right: 25px;
`;
const HoverWrapper = styled.div`
  position: absolute;
  top: 0;
  width: 70px;
  height: 100px;
  border: 10px solid red;
  z-index: 5;
`;

const SLink = styled(Link)``;

const Movie = () => {
  const [data, setData] = useState({}); // popular, nowPlaying upComing  -> data.results에 존재
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));

    return () =>
      window.removeEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  useEffect(async () => {
    const newData = {};
    const {
      data: { results: popular },
    } = await moviesApi.popular();
    const {
      data: { results: nowPlaying },
    } = await moviesApi.nowPlaying();
    const {
      data: { results: upComing },
    } = await moviesApi.upComing();
    let { data: latest } = await moviesApi.latest();
    let {
      data: { results: latestVideo }, // 배열일수 있다.
    } = await moviesApi.videos(parseInt(latest.id));
    // 만일  latest의 비디오가 없으면  nowPlaying의 첫번째 목록을 리스트로 한다.
    if (latestVideo.length === 0) {
      const Random = Math.floor(Math.random() * (nowPlaying.length - 1)) + 1;
      latestVideo = (await moviesApi.videos(parseInt(nowPlaying[Random].id)))
        .data.results;
      latest = nowPlaying[Random];
    }
    console.log(latestVideo);

    setData({ popular, nowPlaying, upComing, latest, latestVideo });
  }, []);

  // 포스터 위에 마우스를 올렸을때  영상이 재생되게 하는 함수 필요(영상데이터를 가져와야 한다.)
  const bringVideo = async (e) => {};

  // scroll 스피더 조절
  const scrollSpeeder = (where, who) => {
    //who => node
    const init = Math.floor(who.scrollLeft);
    let start = Math.floor(who.scrollLeft);
    let test = 0;
    //Math.floor를 사용해보자 =>  who.scrollLeft가 들쭉날쭊 (소수점으로)
    if (where === "right") {
      const rightSpeeder = setInterval(() => {
        test++;
        console.log(test);
        start = start + Math.floor(width / 10);
        console.log(start);
        console.log(width + init);
        who.scrollLeft = start; // who.scrollLeft가 일정하지 않음'

        if (start + 15 >= width + init) {
          who.scrollLeft = width + init;
          clearInterval(rightSpeeder);
        }
      }, 15);
    } else {
      const leftSpeeder = setInterval(() => {
        start = start - Math.ceil(width / 10) - 3;
        who.scrollLeft = who.scrollLeft - Math.ceil(width / 10) - 3;
        if (start < init - width) {
          clearInterval(leftSpeeder);
        }
      }, 15);
    }
  };

  // 포스터 슬라이더 기능 구현
  const handleSlider = (e) => {
    const {
      currentTarget: { id, previousSibling },
    } = e;

    if (id === "left") {
      //scrollWidth // scrollLeft // clientWidth
      if (previousSibling.scrollLeft !== 0) {
        scrollSpeeder("left", previousSibling);
      }
    } else {
      if (
        Math.ceil(
          previousSibling.previousSibling.scrollLeft +
            previousSibling.previousSibling.offsetWidth
        ) < previousSibling.previousSibling.scrollWidth
      ) {
        // 2500
        scrollSpeeder("right", previousSibling.previousSibling);
        if (
          previousSibling.previousSibling.scrollLeft >
          previousSibling.previousSibling.scrollWidth -
            previousSibling.previousSibling.scrollLeft
        ) {
          setTimeout(
            () =>
              (previousSibling.previousSibling.scrollLeft = Math.ceil(
                previousSibling.previousSibling.sliderWidth / 4
              )),
            50
          );
        }
      }
    }
  };

  return Object.keys(data).length !== 0 ? (
    <Container>
      <HeaderImage>
        {data["latestVideo"]?.length !== 0 ? (
          <div className="Image">
            <iframe
              src={`https://www.youtube.com/embed/${data["latestVideo"][0].key}?autoplay=1&mute=1&amp;loop=1;playlist=${data["latestVideo"][0].key}`}
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
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
          <SLink to={`/${data["latest"].id}`}>
            <button>상세정보</button>
          </SLink>
        </HeaderInfo>
      </HeaderImage>

      <ContentWrapper>
        <SectionWrapper>
          <h1>Popular Movie</h1>
          <MoviesWrapper>
            {data !== {}
              ? data["popular"].map((item, index) =>
                  index > 9 ? (
                    <MovieWrapper>
                      <SLink to={`/${item.id}`}>
                        <img
                          src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                        />
                        <HoverWrapper></HoverWrapper>
                      </SLink>
                    </MovieWrapper>
                  ) : (
                    ""
                  )
                )
              : ""}
            {data !== {}
              ? data["popular"].map((item) => (
                  <MovieWrapper>
                    <SLink to={`/${item.id}`}>
                      <img
                        src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      />
                      <HoverWrapper></HoverWrapper>
                    </SLink>
                  </MovieWrapper>
                ))
              : ""}
            {data !== {}
              ? data["popular"].map((item, index) =>
                  index < 10 ? (
                    <MovieWrapper>
                      <SLink to={`/${item.id}`}>
                        <img
                          src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                        />
                        <HoverWrapper></HoverWrapper>
                      </SLink>
                    </MovieWrapper>
                  ) : (
                    ""
                  )
                )
              : ""}
          </MoviesWrapper>
          <IconWrapper id="left" onClick={handleSlider}>
            <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>
          </IconWrapper>
          <IconWrapper id="right" onClick={handleSlider}>
            <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
          </IconWrapper>
        </SectionWrapper>
        <SectionWrapper>
          <h1>Now Playing</h1>
          <MoviesWrapper>
            {data !== {}
              ? data["nowPlaying"].map((item) => (
                  <SLink to={`/${item.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    />
                  </SLink>
                ))
              : ""}
          </MoviesWrapper>
        </SectionWrapper>
        <SectionWrapper>
          <h1>UpComing</h1>
          <MoviesWrapper>
            {data !== {}
              ? data["upComing"].map((item) => (
                  <SLink to={`/${item.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    />
                  </SLink>
                ))
              : ""}
          </MoviesWrapper>
        </SectionWrapper>
      </ContentWrapper>
      <SearchPage></SearchPage>
    </Container>
  ) : (
    "Loading.."
  );
};

export default Movie;
