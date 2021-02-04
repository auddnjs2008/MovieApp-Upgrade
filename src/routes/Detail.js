import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { dramaApi, moviesApi } from "../api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import SearchPage from "../component/SearchPage";
import SeasonBox from "../component/SeasonBox";
import EndPage from "../component/DetailBook/EndPage";
import CountryPage from "../component/DetailBook/CountryPage";
import RelatedPage from "../component/DetailBook/RelatedPage";
import ActorPage from "../component/DetailBook/ActorPage";
import InfoPage from "../component/DetailBook/InfoPage";
import ProfilePage from "../component/DetailBook/ProfilePage";

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
  height: 95vh;
  top: 40px;
  color: black;
  padding: 20px;

  section {
    box-shadow: -10px 5px 1px rgba(247, 241, 227, 1), inset 5px -5px 1px black;
    transform-origin: ${(props) =>
      props.width > 550 ? "0% 50%" : "center center"};

    border-radius: 20px;
    background-color: rgba(247, 241, 227, 1);
    border: 1px solid black;
    margin-left: ${(props) => (props.width > 550 ? "50%" : "")};
    padding: 5px;
    width: ${(props) => (props.width > 550 ? "47%" : "100%")};
    @keyframes bookNext {
      0% {
        transform: perspective(1800px) rotateY(0deg);
      }
      100% {
        transform: perspective(1800px) rotateY(-180deg);
      }
    }
    @keyframes bookPrev {
      0% {
        transform: perspective(1800px) rotateY(-180deg);
      }
      100% {
        transform: perspective(1800px) rotateY(0deg);
      }
    }

    @keyframes phoneNext {
      0% {
        transform: translateX("");
      }
      100% {
        transform: translateX(-100%);
      }
    }

    @keyframes phonePrev {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(0%);
      }
    }
    // transform: perspective(300px);
    // animation: bookNext 1s linear forwards;
  }
`;

const ArrowRapper = styled.span`
  #right,
  #left {
    z-index: 15;
    color: rgb(231, 76, 60);
    font-size: 50px;
    position: absolute;
    top: ${(props) => (props.width > 800 ? "50%" : "80%")};
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
  const [width, setWidth] = useState(window.innerWidth);
  const [season, setSeason] = useState("");
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
      if (width > 550) {
        setChange(index !== 6 ? true : false);
        setIndex((prev) => (index !== 6 ? prev + 1 : 6));
      } else {
        // 화면이  550 이하일 경우
        setChange(index !== 11 ? true : false);
        setIndex((prev) => (index !== 11 ? prev + 1 : 11));
      }
      setDirect("right");
    }
  };

  const getData = async () => {
    const where = window.location.href.split("#/")[1];
    const id = where.split("/")[0];
    const type = where.split("/")[1];
    const data =
      type === "movie" ? await moviesApi.detail(id) : await dramaApi.detail(id);

    const collections =
      type === "movie" && data.data.belongs_to_collection
        ? await moviesApi.collection(data.data.belongs_to_collection.id)
        : undefined;

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
      collections: collections !== undefined ? collections.data : undefined,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
    return () =>
      window.removeEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    return () => setData(null);
  }, []);

  useEffect(() => {
    // index가 바뀌면  그 index의 화면이 앞에나와야 한다.  넘어간 페이지에 zIndex를 조정해줘야한다.

    if (cards && width > 550) {
      // 화면이 550px 이상일때는
      if (direction === "left" && change) {
        cards[5 - index].style.animation = "bookPrev 1s linear forwards";
        setTimeout(() => {
          cards[5 - index].style.zIndex = "0";
          cards[5 - index].style.boxShadow =
            "-10px 5px 1px rgba(247, 241, 227, 1), inset 5px -5px 1px black";
        }, 500);
        cards[5 - index].childNodes[1].style.display = "none";
        cards[5 - index].childNodes[0].style.display = "block";
      } else if (direction === "right" && change) {
        cards[5 - (index - 1)].style.animation = "bookNext 1s linear forwards";
        setTimeout(() => {
          cards[5 - (index - 1)].style.zIndex = `${index - 1}`;
          cards[5 - (index - 1)].style.boxShadow = "none";
        }, 500);
        cards[5 - (index - 1)].childNodes[0].style.display = "none";
        cards[5 - (index - 1)].childNodes[1].style.transform =
          "rotateY(180deg)";

        cards[5 - (index - 1)].childNodes[1].style.display = "block";

        // BackPage의 내용을 바꿔줘야 한다.
      }
    } else if (cards && width <= 550) {
      const Page = Math.ceil(index / 2);
      // 화면이 모바일일경우

      if (direction === "left" && change) {
        if (index % 2 === 0) {
          cards[5 - Page].style.animation = "bookPrev 1s linear forwards";
          cards[5 - Page].childNodes[1].style.display = "none";
          cards[5 - Page].childNodes[0].style.display = "block";
        } else {
          cards[5 - (Page - 1)].style.animation =
            "phonePrev 1s linear forwards";
        }
      } else if (direction === "right" && change) {
        if (index % 2 !== 1) {
          cards[5 - (Page - 1)].childNodes[1].style.transform = "unset";
          cards[5 - (Page - 1)].style.animation =
            "phoneNext 1s linear forwards";
        } else {
          cards[5 - (Page - 1)].style.animation = "bookNext 1s linear forwards";
          cards[5 - (Page - 1)].childNodes[0].style.display = "none";
          cards[5 - (Page - 1)].childNodes[1].style.display = "block";
          cards[5 - (Page - 1)].childNodes[1].style.transform =
            "rotateY(180deg)";
        }
      }
    }
  }, [index, cards, change, width, direction]);

  useEffect(() => {
    // data가 다 찾아지면  요소가 그려진다.

    if (book.current) {
      const Book = book.current.childNodes;
      setCards(Book);
    }
  }, [data]);

  // profile -> Info ->Video ->Actor->Message-> Related (사진(연두),노랑,초록,빨강,검정,파랑) 543210
  return data ? (
    <>
      <ShadowBox background={data["results"].backdrop_path}></ShadowBox>
      <Container ref={book} width={width}>
        <EndPage data={data["results"]}></EndPage>
        <CountryPage data={data} setSeason={setSeason}></CountryPage>
        <RelatedPage data={data}></RelatedPage>
        <ActorPage data={data} width={width}></ActorPage>
        <InfoPage data={data}></InfoPage>
        <ProfilePage data={data}></ProfilePage>
      </Container>
      <SearchPage></SearchPage>
      <ArrowRapper width={width}>
        <FontAwesomeIcon
          icon={faChevronLeft}
          id="left"
          onClick={arrowBtnClick}
        ></FontAwesomeIcon>
      </ArrowRapper>
      <ArrowRapper width={width}>
        <FontAwesomeIcon
          icon={faChevronRight}
          id="right"
          onClick={arrowBtnClick}
        ></FontAwesomeIcon>
      </ArrowRapper>
      <SeasonBox
        width={width}
        season={season}
        setSeason={setSeason}
        id={data.id}
      ></SeasonBox>
    </>
  ) : (
    ""
  );
};

export default Detail;
