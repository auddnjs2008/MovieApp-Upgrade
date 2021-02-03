import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { dramaApi, moviesApi } from "../api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import SearchPage from "../component/SearchPage";
import SeasonBox from "../component/SeasonBox";

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

const ItemRelated = styled.section`
  position: absolute;
  top: 0;
  //width: 47%;
  height: 95%;
  h1 {
    margin-top: 15px;
    text-align: center;
    font-size: 25px;
    font-weight: 600;
  }
  .backPage {
    padding: 10px;
    h1 {
      margin-bottom: 30px;
    }
    .companyWrapper {
      color: white;
      overflow: auto;
      height: 70vh;
      display: grid;
      justify-items: center;
      align-items: center;
      grid-auto-rows: 35vh;
      gap: 10px;
      .company {
        background-color: rgba(64, 115, 158, 1);
        padding: 30px;

        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: 4fr 1fr 1fr;
        justify-items: center;
        align-items: center;
        img {
          max-width: 130px;
          max-height: 130px;
          width: auto;
          height: auto;
        }
      }
    }
  }
`;
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
const ItemActor = styled.section`
  position: absolute;
  top: 0;
  //width: 47%;
  height: 95%;
  .backPage {
    h1 {
      margin-top: 15px;
      text-align: center;
      font-size: 25px;
      font-weight: 600;
    }
    .reviewWrapper {
      margin-top: 30px;
      padding: 20px;
      overflow: auto;
      height: 70vh;
      div.review {
        margin-bottom: 20px;
        div {
          font-size: 15px;
          width: 60px;
          margin-bottom: 5px;
          img {
            width: 50px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            object-fit: cover;
          }
        }
        p {
          border: 2px solid black;
          background-color: rgba(64, 115, 158, 1);
          color: white;
          padding: 15px;
          line-height: 1.2;
          border-radius: 20px;
          border-bottom-left-radius: 0;
          margin-bottom: 5px;
        }
      }
      .noReviews {
        margin: 0 auto;
        margin-top: 20px;
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
    }
  }
`;

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
const ItemProfile = styled.section`
  position: absolute;
  background-image: ${(props) => `url(${props.src})`};
  //background-size: contain;
  background-position: center center;

  top: 0;
  display: flex;
  // width: 47%;
  height: 95%;
  justify-content: center;
  align-items: center;
  .profile {
    background-color: rgba(15, 15, 15, 0.5);
    color: white;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    h1 {
      font-size: 25px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 10px;
      text-shadow: 5px 2px 2px black;
    }
  }
  .backPage {
    padding: 20px;
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: rgba(15, 15, 15, 0.5);
    color: white;

    .semiInfo {
      height: 100%;
      display: grid;
      grid-template-rows: repeat(4, 1fr);
      span {
        h5 {
          margin-bottom: 20px;
          font-size: 20px;
          font-weight: 600;
        }
      }

      button {
        justify-self: center;
        width: 50px;
        height: 50px;
        border: none;
        outline: none;
        color: white;
        background-color: rgba(64, 115, 158, 1);
        border-radius: 5px;
        &:active {
          transform: scale(0.98, 0.98);
        }
      }
    }
  }
`;

const BackPage = styled.div`
  display: none;
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

const ActorWrapper = styled.div`
  h1 {
    font-size: 25px;
    font-weight: 600;
    text-align: center;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .actorWrapper {
    padding: 10px;
    height: 70vh;
    display: grid;
    grid-template-columns: ${(props) =>
      props.width > 800 ? "repeat(2, 1fr)" : ""};
    /* grid-template-rows:${(props) => (props.width > 550 ? "" : "")} */
    gap: 5px;
    padding: 20px;
    //justify-items: center;
    overflow: auto;
    .actorProfile {
      display: flex;
      flex-direction: ${(props) => (props.width > 500 ? "" : "column")};
      img {
        height: 100px;
        width: 80px;
        margin-bottom: 5px;
      }
      div.actorInfo {
        margin-left: 10px;
        height: 130px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        button {
          margin-top: 20px;
          width: 40px;
          height: 25px;
          border: none;
          outline: none;
          color: white;
          padding: 0;
          background-color: rgba(64, 115, 158, 1);
          border-radius: 5px;
          &:active {
            transform: scale(0.98, 0.98);
          }
        }
      }
    }
  }
  .noActors {
    margin: 0 auto;
    margin-top: 70px;
    position: relative;

    width: 200px;
    height: 200px;
    justify-self: center;
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

const RelatedWrapper = styled.div`
  div.relatedBox {
    margin-top: 30px;
    display: grid;
    grid-auto-rows: 1fr;
    row-gap: 10px;
    padding: 10px;
    height: 70vh;
    overflow: auto;

    div.itemWrapper {
      display: grid;
      grid-template-columns: 100px 1fr;
      background-color: rgba(64, 115, 158, 0.6);
      padding: 10px;
      border-radius: 10px;
      gap: 10px;
      &:hover {
        background-color: rgba(15, 15, 15, 0.8);
        color: white;
      }
      img {
        width: 100px;
        height: 130px;
      }
      div.relatedContent {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        h2 {
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
  }
  .noRelative {
    margin: 0 auto;
    margin-top: 70px;
    position: relative;

    width: 200px;
    height: 200px;
    justify-self: center;
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

  const onClick = (e) => {
    const {
      currentTarget: { id: seasonId },
    } = e;
    setSeason(seasonId);
  };

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
    getData();
    window.addEventListener("resize", () => setWidth(window.innerWidth));
    return () =>
      window.removeEventListener("resize", () => setWidth(window.innerWidth));
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
  }, [index]);

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
        <ItemEnd
          src={`https://image.tmdb.org/t/p/w300${data["results"].poster_path}`}
        >
          <h1>Thank you</h1>
          <BackPage className="backPage">
            <h1>The End</h1>
          </BackPage>
        </ItemEnd>
        <ItemCountry>
          <div>
            <h1>Production Countries</h1>
            <div className="countries">
              {data["results"].production_countries.length
                ? data["results"].production_countries.map((item) => (
                    <div className="country">
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
                ? data["collections"].parts.map((item) => (
                    <Link
                      to={`/${item.id}/movie`}
                      onClick={() => window.location.reload()}
                    >
                      <SeriesWrapper
                        className="series-item"
                        src={`https://image.tmdb.org/t/p/w300${item.backdrop_path}`}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                        />
                        <div>{item.original_title}</div>
                      </SeriesWrapper>
                    </Link>
                  ))
                : data["results"].seasons
                ? data["results"].seasons.map((item) => (
                    <div
                      className="season"
                      id={item.season_number}
                      onClick={onClick}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      ></img>
                      <div>{item.name}</div>
                    </div>
                  ))
                : ""}
            </div>
          </BackPage>
        </ItemCountry>

        <ItemRelated>
          <RelatedWrapper>
            <h1>Related</h1>
            {data["similar"].results.length ? (
              <div className="relatedBox">
                {data["similar"].results.map((item) => (
                  <Link
                    to={`/${item.id}/${data.type}`}
                    onClick={() =>
                      setTimeout(() => window.location.reload(), 50)
                    }
                  >
                    <div className="itemWrapper">
                      <img
                        src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      />
                      <div className="relatedContent">
                        <h2>
                          {item.original_name
                            ? item.original_name
                            : item.original_title}
                        </h2>
                        <div>⭐{item.vote_average}</div>
                        <div>{item.release_date}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="noRelative">
                <img src="https://usecloud.s3-ap-northeast-1.amazonaws.com/%EC%96%B4%EB%AA%BD%EC%96%B4%EC%8A%A43.PNG" />
                <div>There are no Information</div>
              </div>
            )}
          </RelatedWrapper>
          <BackPage className="backPage">
            <h1>Production Company</h1>
            <div className="companyWrapper">
              {data.results.production_companies.length
                ? data.results.production_companies.map((item) =>
                    item.logo_path ? (
                      <div className="company">
                        <img
                          src={`https://image.tmdb.org/t/p/w300${item.logo_path}`}
                        />
                        <div>{item.name}</div>
                        <div>{item.origin_country}</div>
                      </div>
                    ) : (
                      ""
                    )
                  )
                : ""}
            </div>
          </BackPage>
        </ItemRelated>
        <ItemActor
          src={`https://image.tmdb.org/t/p/w300${data["results"].poster_path}`}
        >
          <ActorWrapper width={width}>
            <h1>Actors</h1>
            {data["actors"].cast.length ? (
              <div className="actorWrapper">
                {data["actors"].cast.map((item) => (
                  <div className="actorProfile">
                    <img
                      src={
                        item.profile_path
                          ? `https://image.tmdb.org/t/p/w300${item.profile_path}`
                          : "https://usecloud.s3-ap-northeast-1.amazonaws.com/%EC%96%B4%EB%AA%BD%EC%96%B4%EC%8A%A4.PNG"
                      }
                    ></img>
                    <div className="actorInfo">
                      <div>{item.name}</div>
                      <Link to={`/actor/${item.credit_id}`}>
                        <button>Detail</button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="noActors">
                <img src="https://usecloud.s3-ap-northeast-1.amazonaws.com/%EC%96%B4%EB%AA%BD%EC%96%B4%EC%8A%A43.PNG" />
                <div>There are no Information</div>
              </div>
            )}
          </ActorWrapper>
          <BackPage className="backPage">
            <h1>Reviews</h1>
            <div className="reviewWrapper">
              {data.reviews.results.length ? (
                data.reviews.results.map((item) => (
                  <div className="review">
                    <div>
                      <img src="https://usecloud.s3-ap-northeast-1.amazonaws.com/%EC%96%B4%EB%AA%BD%EC%96%B4%EC%8A%A4.PNG"></img>
                      <span>{item.author}</span>
                    </div>
                    <p>{item.content}</p>
                    <span>{item.created_at}</span>
                  </div>
                ))
              ) : (
                <div className="noReviews">
                  <img src="https://usecloud.s3-ap-northeast-1.amazonaws.com/%EC%96%B4%EB%AA%BD%EC%96%B4%EC%8A%A42.PNG" />
                  <div>There are no Reviews</div>
                </div>
              )}
            </div>
          </BackPage>
        </ItemActor>
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
                data.results.videos.results.map((item) => (
                  <div className="videoBox">
                    <iframe
                      src={`https://www.youtube.com/embed/${item.key}?ps=blogger&showinfo=0&cc_load_policy=0&iv_load_policy=3&vq=hd720&rel=0&fs=0&amp;loop=1;playlist=${item.key}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))
              ) : (
                <div className="noVideos">
                  <img src="https://usecloud.s3-ap-northeast-1.amazonaws.com/%EC%96%B4%EB%AA%BD%EC%96%B4%EC%8A%A42.PNG" />
                  <div>There are no Videos</div>
                </div>
              )}
            </VideoWrapper>
          </BackPage>
        </ItemInfo>
        <ItemProfile
          src={`https://image.tmdb.org/t/p/w300${data["results"].poster_path}`}
        >
          <div className="profile">
            <h1>
              {data.type === "movie"
                ? data["results"].original_title
                : data["results"].original_name}
            </h1>
            {/* <img
              src={`https://image.tmdb.org/t/p/w300${data["results"].poster_path}`}
            /> */}
          </div>
          <BackPage className="backPage">
            <div className="semiInfo">
              <span>
                <h5>
                  {data["results"].release_date ? "Release" : "First_Air_Date"}
                </h5>
                {data["results"].release_date
                  ? data["results"].release_date
                  : data["results"].first_air_date}
              </span>
              <span>
                <h5>Genres</h5>
                {data["results"].genres.map((item) => item.name).join("/")}
              </span>
              <span>
                <h5>Grade</h5>⭐{data["results"].vote_average}
              </span>
              <a
                href={`https://www.imdb.com/title/${data["results"].imdb_id}`}
                target="_blank"
              >
                <button>
                  IMDB <br /> Site
                </button>
              </a>
            </div>
          </BackPage>
        </ItemProfile>
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
