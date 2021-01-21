import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { dramaApi, moviesApi } from "../api";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const ShadowBox = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: ${(props) =>
    `url("https://image.tmdb.org/t/p/w500${props.background}")`};
  background-size: cover;
  background-position: center;
  opacity: 0.5;
`;

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 90vh;
  top: 40px;
  color: white;
  padding: 20px;

  border: 1px solid red;

  section {
    transform-origin: 0% 50%;
    @keyframes bookNext {
      0% {
        transform: perspective(600px) rotateY(0deg);
      }
      100% {
        transform: perspective(600px) rotateY(-150deg);
      }
    }
    @keyframes bookPrev {
      0% {
        transform: perspective(600px) rotateY(-150deg);
      }
      100% {
        transform: perspective(600px) rotateY(0deg);
      }
    }

    transform: perspective(600px);
    // animation: bookNext 1s linear forwards;
  }
`;

const ItemRelated = styled.section`
  position: absolute;
  top: 0;
  width: 98%;
  height: 98vh;
  background-color: blue;
`;
const ItemMessage = styled.section`
  position: absolute;
  top: 0;
  width: 98%;
  height: 98vh;
  background-color: black;
`;
const ItemActor = styled.section`
  position: absolute;
  top: 0;
  width: 98%;
  height: 98vh;
  background-color: red;
`;

const ItemVideo = styled.section`
  position: absolute;
  top: 0;
  width: 98%;
  height: 98vh;
  background-color: green;
`;
const ItemInfo = styled.section`
  position: absolute;
  top: 0;
  width: 98%;
  height: 98vh;
  background-color: yellow;
`;
const ItemProfile = styled.section`
  // profile -> Info ->Video ->Actor->Message-> Related (사진(연두),노랑,초록,빨강,검정,파랑) 543210
  position: absolute;
  background-color: yellowgreen;
  top: 0;
  border: 1px solid red;
  display: flex;
  width: 98%;
  justify-content: center;
  .profile {
    h1 {
      font-size: 25px;
      text-align: center;
      margin-bottom: 10px;
    }
    img {
      border-radius: 20px;
    }
  }
`;

const ArrowRapper = styled.span`
  #right,
  #left {
    z-index: 15;
    color: white;
    font-size: 50px;
    position: absolute;
    top: 50%;
    left: 50px;
    transform: translateY(-50%);
    &:active {
      font-size: 45px;
    }
  }
  #right {
    left: unset;
    right: 50px;
  }
`;

// 영화의 제목과 포스터      영화 요약본 & 평점 & 런타임 &

// 리뷰  , 유튜브영상 , similar Movies, 출연배우,
const Detail = () => {
  const [data, setData] = useState(null);
  const [cards, setCards] = useState(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirect] = useState(""); // 무슨버튼 눌렀는지 알려준다. // 제일 끝과 처음을 인지해야한다.
  const [change, setChange] = useState(true);
  const book = useRef();

  const arrowBtnClick = (e) => {
    const {
      currentTarget: { id },
    } = e;
    if (id === "left") {
      setChange(index ? true : false);
      setIndex((prev) => (index ? prev - 1 : 0));
      setDirect("left");
    } else {
      setChange(index !== 5 ? true : false);
      setIndex((prev) => (index !== 5 ? prev + 1 : 5));
      setDirect("right");
    }
  };

  useEffect(() => {
    // index가 바뀌면  그 index의 화면이 앞에나와야 한다.
    if (cards) {
      cards.forEach((item, number) =>
        number !== 5 - index
          ? (item.style.zIndex = 0)
          : (item.style.zIndex = 10)
      );
      if (direction === "left" && change) {
        cards[5 - index].style.animation = "bookPrev 1s linear forwards";
      } else if (direction === "right" && change) {
        cards[5 - (index - 1)].style.animation = "bookNext 1s linear forwards";
      }
    }
  }, [index]);

  useEffect(() => {
    // data가 다 찾아지면  요소가 그려진다.

    if (book.current) {
      const Book = book.current.childNodes;
      setCards(Book);
    }
  }, [data]);

  useEffect(async () => {
    const where = window.location.href.split("#/")[1];
    const id = where.split("/")[0];
    const type = where.split("/")[1];
    const data =
      type === "movie" ? await moviesApi.detail(id) : await dramaApi.detail(id);

    const actors =
      type === "movie"
        ? await moviesApi.peoples(id)
        : await dramaApi.peoples(id);
    const reviews =
      type === "movie"
        ? await moviesApi.reviews(id)
        : await dramaApi.reviews(id);

    const similar =
      type === "movie"
        ? await moviesApi.similar(id)
        : await dramaApi.similar(id);

    setData({
      results: data.data,
      type,
      id,
      actors: actors.data,
      reviews: reviews.data,
      similar: similar.data,
    });
  }, []);

  return data ? (
    <>
      <ShadowBox background={data["results"].backdrop_path}></ShadowBox>
      <Container ref={book}>
        <ItemRelated></ItemRelated>
        <ItemMessage></ItemMessage>
        <ItemActor></ItemActor>
        <ItemVideo></ItemVideo>
        <ItemInfo></ItemInfo>
        <ItemProfile>
          <div className="profile">
            <h1>
              {data.type === "movie"
                ? data["results"].original_title
                : data["results"].original_name}
            </h1>
            <img
              src={`https://image.tmdb.org/t/p/w300${data["results"].poster_path}`}
            />
          </div>
        </ItemProfile>
      </Container>
      <ArrowRapper>
        <FontAwesomeIcon
          icon={faChevronLeft}
          id="left"
          onClick={arrowBtnClick}
        ></FontAwesomeIcon>
      </ArrowRapper>
      <ArrowRapper>
        <FontAwesomeIcon
          icon={faChevronRight}
          id="right"
          onClick={arrowBtnClick}
        ></FontAwesomeIcon>
      </ArrowRapper>
    </>
  ) : (
    ""
  );
};

export default Detail;
{
  /* <div className="info">
            <div className="semiInfo">
              <span>
                <h5>Release</h5>
                {data["results"].release_date}
              </span>
              <span>
                <h5>Genres</h5>
                {data["results"].genres.map((item) => item.name).join("/")}
              </span>
              <span>
                <h5>Grade</h5>
                {data["results"].vote_average}
              </span>
              <button>
                <a
                  href={`https://www.imdb.com/title/${data["results"].imdb_id}`}
                  target="_blank"
                >
                  IMDB
                </a>
              </button>
            </div>
          <p>{data["results"].overview}</p> 
          </div>*/
}

{
  /* <VideoWrapper>
              {data.results.videos.results.length !== 0
                ? data.results.videos.results.map((item) => (
                    <div className="videoBox">
                      <iframe
                        src={`https://www.youtube.com/embed/${item.key}?vq=hd720&autoplay=1&mute=1&amp;loop=1;playlist=${item.key}`}
                        frameborder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullscreen
                      ></iframe>
                    </div>
                  ))
                : ""}
            </VideoWrapper> */
}
