import React, { useEffect, useRef, useState } from "react";
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

const ContentWrapper = styled.div`
  div.hoverBox {
    background-color: rgba(20, 20, 20, 1);
    border-radius: 20px;
    width: 100px;
    height: 130px;
    color: white;

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
      font-size: 10px;
      text-align: center;
      margin: 5px 0px;
      padding: 10px;
    }
    div {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      button {
        width: 10px;
        height: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      a {
        font-size: 10px;
        border: 1px solid white;
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
const MoviesWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  width: 99vw;

  overflow: auto;
  // overflow-y: hidden;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
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
    height: 150px;
    width: 30px;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(15, 15, 15, 0.7);
    color: white;
    opacity: 0;
  }
  &#right {
    right: 0;
  }
`;
const MovieWrapper = styled.div`
  position: relative;
  margin-right: 25px;
`;

const SLink = styled(Link)``;

const Movie = () => {
  const [data, setData] = useState({}); // popular, nowPlaying upComing  -> data.results에 존재
  const [width, setWidth] = useState(window.innerWidth);
  const [testTimer, setTimer] = useState(null);

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));

    return () =>
      window.removeEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  useEffect(async () => {
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
  }, []);

  // 포스터 위에 마우스를 올렸을때  영상이 재생되게 하는 함수 필요(영상데이터를 가져와야 한다.)
  const hoverVideo = (dataArray, videoId) => {
    const hoverBox = document.querySelector(".hoverBox");
    if (hoverBox) {
      const videoWrapper = document.createElement("div");
      videoWrapper.style.position = "relative";
      videoWrapper.style.height = "0";
      videoWrapper.style.paddingBottom = "56.25%";

      const video = document.createElement("iframe");
      video.src = `https://www.youtube.com/embed/${dataArray[0].key}?ps=blogger&showinfo=0&cc_load_policy=0&iv_load_policy=3&vq=hd720&rel=0&fs=0&control=0&autoplay=1&mute=1&amp;loop=1;playlist=${dataArray[0].key}`;
      video.frameborder = "0";
      video.width = "100%";
      video.height = "100%";
      video.allow =
        "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
      video.style.position = "absolute";
      video.style.left = "0";
      video.style.top = "0";
      video.style.width = "100%";
      video.style.height = "100%";
      videoWrapper.appendChild(video);
      // 제목이랑  상세정보 보기 버튼이 필요하다.
      const title = document.createElement("h4");
      title.innerText = dataArray[0].name.split("|")[0].split("Trailer")[0];

      const btnWrapper = document.createElement("div");

      const shareBtn = document.createElement("button");
      shareBtn.innerText = "+";
      const link = document.createElement("a");
      link.href = `/#/${videoId}`;
      link.innerText = "상세정보";
      btnWrapper.appendChild(shareBtn);
      btnWrapper.appendChild(link);
      hoverBox.appendChild(videoWrapper);
      hoverBox.appendChild(title);
      hoverBox.appendChild(btnWrapper);
    }
    //<iframe width="246" height="200" src="https://www.youtube.com/embed/F40YOxvwTjg" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  };

  const createBox = async (where, id) => {
    const containerBox = document.querySelector(".content");

    if (containerBox) {
      if (document.querySelector(".hoverBox"))
        containerBox.removeChild(document.querySelector(".hoverBox"));

      const {
        data: { results: videos, id: videoId },
      } = await moviesApi.videos(parseInt(id));

      const hoverBox = document.createElement("div");
      hoverBox.className = "hoverBox";
      hoverBox.style.position = "absolute";
      hoverBox.style.top = String(where.y + window.scrollY) + "px";
      hoverBox.style.left = String(where.x) + "px";

      hoverBox.addEventListener("mouseleave", setOriginal);
      containerBox.appendChild(hoverBox);
      hoverVideo(videos, videoId);
    }
  };

  const bringVideo = async (e) => {
    const {
      currentTarget: { id },
    } = e;
    const {
      currentTarget: {
        firstChild: { lastChild },
      },
    } = e;

    const where = e.currentTarget.getBoundingClientRect();

    //timerSetting = setTimeout(() => createBox(where), 1200); // 2초전에 마우스가 나가면 clearTimeout을 해줘야 한다.
    setTimer(setTimeout(() => createBox(where, id), 1200)); // 2초전에 마우스가 나가면 clearTimeout을 해줘야 한다.

    // 비디오를 찾아서 화면에 넣어주어야 한다.
  };

  // 확대된 포스터 위에서 마우스가 벗어났을 때  원래대로 되돌린다.

  const setOriginal = () => {
    //timer = 0;
    setTimer(null);
    const containerBox = document.querySelector(".content");
    const hoverBox = document.querySelectorAll(".hoverBox");

    if (hoverBox) hoverBox.forEach((item) => containerBox.removeChild(item));
  };

  const setClearTime = () => {
    if (testTimer !== null) {
      //clearTimeout(timerSetting);
      clearTimeout(testTimer);
    }
  };

  // 포스터 슬라이더 기능 구현
  const handleSlider = (e) => {
    const {
      currentTarget: { id, previousSibling },
    } = e;

    let contentWidth =
      e.id === "left"
        ? Math.ceil(previousSibling.offsetWidth) + 25 + 8
        : Math.ceil(previousSibling.previousSibling.offsetWidth) + 25 + 8;

    if (id === "left") {
      //scrollWidth // scrollLeft // clientWidth
      if (previousSibling.scrollLeft !== 0) {
        //scrollSpeeder("left", previousSibling);
        previousSibling.scrollLeft =
          Math.ceil(previousSibling.scrollLeft) - contentWidth;
        if (previousSibling.scrollLeft - contentWidth <= 0) {
          setTimeout(() => {
            previousSibling.style.scrollBehavior = "auto";
            previousSibling.scrollLeft = contentWidth * 2;
            previousSibling.style.scrollBehavior = "smooth";
          }, 500);
        }
      }
    } else {
      const { previousSibling: rightSibling } = previousSibling;
      if (
        Math.ceil(rightSibling.scrollLeft + rightSibling.offsetWidth) <
        rightSibling.scrollWidth
      ) {
        // 2500
        rightSibling.scrollLeft =
          Math.ceil(rightSibling.scrollLeft) + contentWidth;
        if (
          rightSibling.scrollLeft >
          rightSibling.scrollWidth - rightSibling.scrollLeft
        ) {
          setTimeout(() => {
            rightSibling.style.scrollBehavior = "auto";
            rightSibling.scrollLeft = contentWidth;
            rightSibling.style.scrollBehavior = "smooth";
          }, 500);
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
              src={`https://www.youtube.com/embed/${data["latestVideo"][0].key}?vq=hd720&autoplay=1&mute=1&amp;loop=1;playlist=${data["latestVideo"][0].key}`}
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullscreen
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

      <ContentWrapper className="content">
        <SectionWrapper>
          <h1>Popular Movie</h1>
          <MoviesWrapper>
            {data !== {}
              ? data["popular"].map((item, index) =>
                  index > 9 ? (
                    <MovieWrapper
                      id={item.id}
                      onMouseEnter={bringVideo}
                      onMouseLeave={setClearTime}
                    >
                      <SLink to={`/${item.id}`}>
                        <img
                          src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                        />
                      </SLink>
                    </MovieWrapper>
                  ) : (
                    ""
                  )
                )
              : ""}
            {data !== {}
              ? data["popular"].map((item) => (
                  <MovieWrapper
                    id={item.id}
                    onMouseEnter={bringVideo}
                    onMouseLeave={setClearTime}
                  >
                    <SLink to={`/${item.id}`}>
                      <img
                        src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      />
                    </SLink>
                  </MovieWrapper>
                ))
              : ""}
            {data !== {}
              ? data["popular"].map((item, index) =>
                  index < 10 ? (
                    <MovieWrapper
                      id={item.id}
                      onMouseEnter={bringVideo}
                      onMouseLeave={setClearTime}
                    >
                      <SLink to={`/${item.id}`}>
                        <img
                          src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                        />
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
              ? data["nowPlaying"].map((item, index) =>
                  index > 9 ? (
                    <MovieWrapper
                      id={item.id}
                      onMouseEnter={bringVideo}
                      onMouseLeave={setClearTime}
                    >
                      <SLink to={`/${item.id}`}>
                        <img
                          src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                        />
                      </SLink>
                    </MovieWrapper>
                  ) : (
                    ""
                  )
                )
              : ""}
            {data !== {}
              ? data["nowPlaying"].map((item) => (
                  <MovieWrapper
                    id={item.id}
                    onMouseEnter={bringVideo}
                    onMouseLeave={setClearTime}
                  >
                    <SLink to={`/${item.id}`}>
                      <img
                        src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      />
                    </SLink>
                  </MovieWrapper>
                ))
              : ""}
            {data !== {}
              ? data["nowPlaying"].map((item, index) =>
                  index < 10 ? (
                    <MovieWrapper
                      id={item.id}
                      onMouseEnter={bringVideo}
                      onMouseLeave={setClearTime}
                    >
                      <SLink to={`/${item.id}`}>
                        <img
                          src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                        />
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
          <h1>UpComing</h1>
          <MoviesWrapper>
            {data !== {}
              ? data["upComing"].map((item, index) =>
                  index > 9 ? (
                    <MovieWrapper
                      id={item.id}
                      onMouseEnter={bringVideo}
                      onMouseLeave={setClearTime}
                    >
                      <SLink to={`/${item.id}`}>
                        <img
                          src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                        />
                      </SLink>
                    </MovieWrapper>
                  ) : (
                    ""
                  )
                )
              : ""}
            {data !== {}
              ? data["upComing"].map((item) => (
                  <MovieWrapper
                    id={item.id}
                    onMouseEnter={bringVideo}
                    onMouseLeave={setClearTime}
                  >
                    <SLink to={`/${item.id}`}>
                      <img
                        src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      />
                    </SLink>
                  </MovieWrapper>
                ))
              : ""}
            {data !== {}
              ? data["upComing"].map((item, index) =>
                  index < 10 ? (
                    <MovieWrapper
                      id={item.id}
                      onMouseEnter={bringVideo}
                      onMouseLeave={setOriginal}
                    >
                      <SLink to={`/${item.id}`}>
                        <img
                          src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                        />
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
      </ContentWrapper>
      <SearchPage></SearchPage>
    </Container>
  ) : (
    "Loading.."
  );
};

export default Movie;
