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
import { Link } from "react-router-dom";

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
    transform-origin: 0% 50%;
    border-radius: 20px;
    background-color: rgba(247, 241, 227, 1);
    margin-left: 50%;
    // box-shadow: 10px 4px 1px rgba(20, 20, 20, 0.9);
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

    // transform: perspective(300px);
    // animation: bookNext 1s linear forwards;
  }
`;

const ItemRelated = styled.section`
  position: absolute;
  top: 0;
  width: 47%;
  height: 95%;
`;
const ItemMessage = styled.section`
  position: absolute;
  top: 0;
  width: 47%;
  height: 95%;
`;
const ItemActor = styled.section`
  position: absolute;
  top: 0;
  width: 47%;
  height: 95%;
  .backPage {
    h1 {
      margin-top: 15px;
      text-align: center;
      font-size: 25px;
      font-weight: 600;
    }
    .reviewWrapper {
      border: 10px solid red;
      margin-top: 50px;
      padding: 20px;
      div.review {
        div {
          font-size: 15px;
          border: 1px solid black;
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
      }
    }
  }
`;

const ItemVideo = styled.section`
  position: absolute;
  top: 0;
  width: 47%;
  height: 95%;
`;
const ItemInfo = styled.section`
  position: absolute;
  top: 0;
  width: 47%;
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
  // profile -> Info ->Video ->Actor->Message-> Related (사진(연두),노랑,초록,빨강,검정,파랑) 543210
  position: absolute;

  top: 0;
  display: flex;
  width: 47%;
  height: 95%;
  justify-content: center;
  align-items: center;
  .profile {
    h1 {
      font-size: 25px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 10px;
    }
    img {
      border-radius: 20px;
    }
  }
  .backPage {
    padding: 20px;
    width: 100%;
    height: 100%;
    text-align: center;
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
  margin-top: 40%;
  transform: translateY(-50%);
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
    height: 70vh;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 5px;
    padding: 20px;
    //justify-items: center;
    overflow: auto;
    .actorProfile {
      display: flex;

      img {
        height: 100px;
        width: 80px;
      }
      div.actorInfo {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        button {
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
`;

const RelatedWrapper = styled.div``;

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
  const [content, setContent] = useState([]); // 각장당  앞뒤 내용을 가지고 있어야 한다. 그리고 페이지가 바뀔 때마다 내용을 다시 그려준다.
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
    // index가 바뀌면  그 index의 화면이 앞에나와야 한다.  넘어간 페이지에 zIndex를 조정해줘야한다.

    if (cards) {
      if (direction === "left" && change) {
        cards[5 - index].style.animation = "bookPrev 1s linear forwards";
        setTimeout(() => (cards[5 - index].style.zIndex = "0"), 500);
        cards[5 - index].childNodes[1].style.display = "none";
        cards[5 - index].childNodes[0].style.display = "block";
      } else if (direction === "right" && change) {
        cards[5 - (index - 1)].style.animation = "bookNext 1s linear forwards";
        setTimeout(
          () => (cards[5 - (index - 1)].style.zIndex = `${index - 1}`),
          500
        );
        cards[5 - (index - 1)].childNodes[0].style.display = "none";
        cards[5 - (index - 1)].childNodes[1].style.transform =
          "rotateY(180deg)";

        cards[5 - (index - 1)].childNodes[1].style.display = "block";
      }

      // BackPage의 내용을 바꿔줘야 한다.
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
  console.log(data);
  // profile -> Info ->Video ->Actor->Message-> Related (사진(연두),노랑,초록,빨강,검정,파랑) 543210
  return data ? (
    <>
      <ShadowBox background={data["results"].backdrop_path}></ShadowBox>
      <Container ref={book}>
        <ItemRelated>
          <BackPage className="backPage"></BackPage>
        </ItemRelated>
        <ItemMessage>
          <BackPage className="backPage"></BackPage>
        </ItemMessage>
        <ItemMessage>
          <RelatedWrapper>
            {data["similar"].results.length
              ? data["similar"].results.map((item) => (
                  <div>
                    <img
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    />
                    <span>{item.original_title}</span>
                  </div>
                ))
              : ""}
          </RelatedWrapper>
          <BackPage className="backPage"></BackPage>
        </ItemMessage>
        <ItemActor>
          <ActorWrapper>
            <h1>Actors</h1>
            <div className="actorWrapper">
              {data["actors"].cast.length
                ? data["actors"].cast.map((item) => (
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
                        <Link>
                          <button>Detail</button>
                        </Link>
                      </div>
                    </div>
                  ))
                : ""}
            </div>
          </ActorWrapper>
          <BackPage className="backPage">
            <h1>Reviews</h1>
            <div className="reviewWrapper">
              {data.reviews.results.length
                ? data.reviews.results.map((item) => (
                    <div className="review">
                      <div>
                        <img src="https://usecloud.s3-ap-northeast-1.amazonaws.com/%EC%96%B4%EB%AA%BD%EC%96%B4%EC%8A%A4.PNG"></img>
                        <span>{item.author}</span>
                      </div>
                      <p>{item.content}</p>
                      <span>{item.created_at}</span>
                    </div>
                  ))
                : ""}
            </div>
          </BackPage>
        </ItemActor>
        <ItemInfo>
          <div className="info">
            <h1>OverView</h1>
            <p>{data["results"].overview}</p>
          </div>
          <BackPage className="backPage">
            <h1>Videos</h1>
            <VideoWrapper>
              {data.results.videos.results.length !== 0
                ? data.results.videos.results.map((item) => (
                    <div className="videoBox">
                      <iframe
                        src={`https://www.youtube.com/embed/${item.key}?ps=blogger&showinfo=0&cc_load_policy=0&iv_load_policy=3&vq=hd720&rel=0&fs=0&amp;loop=1;playlist=${item.key}`}
                        frameborder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullscreen
                      ></iframe>
                    </div>
                  ))
                : ""}
            </VideoWrapper>
          </BackPage>
        </ItemInfo>
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
          <BackPage className="backPage">
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
