import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { authService, storeService } from "../fbase";
import { connect } from "react-redux";
import { userActionCreator } from "../store/modules/User";
import { dramaApi, moviesApi } from "../api";
import { Link } from "react-router-dom";
import SearchPage from "../component/SearchPage";
import { myListActionCreator } from "../store/modules/MyList";
import { queryAllByAttribute } from "@testing-library/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBorderStyle,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  margin-top: 80px;
  padding: 20px;
  color: white;
  button {
    margin-bottom: 10px;

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
  .newTicket {
    height: 100%;
    transform: translate(-50%, -20%);
    background-image: url("https://usecloud.s3-ap-northeast-1.amazonaws.com/%EC%98%81%ED%99%94%ED%8B%B0%EC%BC%93.png");
    background-size: cover;
    background-position: center;
    opacity: 0;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 200px;
    gap: 30px;
    justify-items: center;
    div {
      padding: 10px;
      font-weight: 600;
      width: 90%;
      height: 100px;
      background-color: rgba(52, 73, 94, 1);
      border-radius: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
    }
    img {
      width: 100px;
      height: 50%;

      object-fit: contain;
    }
  }
`;

const Wrapper = styled.section`
  width: 100%;
  position: relative;
  margin-bottom: 20px;
  //padding: 10px;
  h1 {
    font-size: 30px;
    padding: 10px;
  }
  #left {
    position: absolute;
    top: 0;
    left: 45%;
    transform: translateX(-50%);
    font-size: 50px;
    width: 50px;
    color: #74b9ff;
  }
  #right {
    position: absolute;
    font-size: 50px;
    width: 50px;
    color: #74b9ff;
    top: 0;
    right: 45%;
    transform: translateX(50%);
    margin-left: 20px;
  }
`;

const MovieWrapper = styled.div`
  display: flex;
  height: 70vh;
  overflow: auto;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const DramaWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 70vh;
  overflow: auto;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }
`;
const Poster = styled.div`
  height: 100%;
  margin-right: 10px;
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 30px;
  img {
    width: 200px;
    height: 100%;
    object-fit: contain;
  }
`;

const DropBox = styled.div`
  width: 100%;
  height: 200px;
  display: none;
  background-color: rgba(20, 20, 20, 0.5);
  position: fixed;
  top: 0;
  background-image: url("https://usecloud.s3-ap-northeast-1.amazonaws.com/%EC%98%81%ED%99%94dropBox.png");
  background-size: cover;
  background-position: center 65%;
  text-align: center;
  div {
    font-size: 30px;
    color: white;
    background-color: black;
    border-radius: 10px;
    margin-top: 10px;
    margin-left: 30vw;
    width: 150px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const TrashBox = styled.div`
  position: absolute;
  width: 100px;
  height: ${(props) => `${props.height}px`};
  z-index: 2;
  display: none;
  background-color: rgba(20, 20, 20, 0.5);
`;
const TrashIcon = styled.div`
  font-size: 100px;
  color: white;
  position: absolute;
  top: ${(props) => `${props.scrollHeight + 100}px`};
`;

const MyPage = ({ logOut, bunchPush, MyList, uid, Pop }) => {
  // 물론  데이터를 데이터베이스에서 바로 가져오는게 더유용하다 생각하지만 리덕스를 연습하기위해  리덕스
  // state를 써서 데이터를 관리하려고 함
  const [movie, setMovie] = useState([]);
  const [drama, setDrama] = useState([]);
  const [scroll, setScroll] = useState(window.scrollY);

  const { Kakao } = window;

  const sliderFunc = (e) => {
    const {
      currentTarget: { id, previousSibling },
    } = e;
    if (id === "left") {
      previousSibling.scrollLeft > 0
        ? (previousSibling.scrollLeft -= previousSibling.offsetWidth)
        : (previousSibling.scrollLeft = 0);
    } else {
      const {
        previousSibling: { previousSibling },
      } = e.currentTarget;
      if (
        previousSibling.scrollLeft + previousSibling.offsetWidth <
        previousSibling.scrollWidth
      )
        previousSibling.scrollLeft += previousSibling.offsetWidth;
    }
  };

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

  const sendKakaoMessage = (item) => {
    // item으로 드라마나 영화 객체 전달
    Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: `영화-${
          item.original_title ? item.original_title : item.original_name
        }`,
        description: item.overview,
        imageUrl: `https://image.tmdb.org/t/p/w300${item.poster_path}`,
        link: {
          mobileWebUrl: "https://developers.kakao.com",
          androidExecParams: "test",
        },
      },
      social: {
        likeCount: item.popularity,
        //commentCount: 20,
        viewCount: item.vote_average,
      },
      buttons: [
        {
          title: "웹으로 이동",
          link: {
            mobileWebUrl: item.homepage,
          },
        },
        {
          title: "앱으로 이동",
          link: {
            mobileWebUrl: "https://developers.kakao.com",
          },
        },
      ],
    });
  };

  const onDrop = async (e) => {
    const {
      currentTarget: { className },
    } = e;
    const rowId = document.querySelector(".newTicket").id;

    e.preventDefault();
    e.stopPropagation();
    const numberId = parseInt(rowId.split("-")[0]);
    const type = rowId.split("-")[1];

    if (className.includes("dropBox")) {
      console.log("공유해줍니다."); // 카톡 공유 기능 구현
      //
      const [data] =
        type === "movie"
          ? movie.filter((item) => item.id === numberId)
          : drama.filter((item) => item.id === numberId);

      sendKakaoMessage(data);
    } else {
      // 파이어베이스 삭제 기능 구현
      const object = await storeService
        .collection(`mwFlix-${uid}`)
        .get(queryAllByAttribute);
      object.forEach((item) => {
        if (item.data().id === numberId) item.ref.delete();
      });
      Pop(numberId); //  state의 상태를 업그레이드 시켜준다.
    }
  };

  const onDragStart = (e) => {
    const container = document.querySelector(".container");

    const { currentTarget } = e;
    const newTicket = document.createElement("div");
    const dropBox = document.querySelector(".dropBox");
    const trashBox = document.querySelector(".trash");
    dropBox.style.zIndex = "10";
    dropBox.style.display = "block";
    trashBox.style.display = "block";
    newTicket.id = currentTarget.id;
    newTicket.className = "newTicket";
    newTicket.innerHTML = currentTarget.innerHTML;
    newTicket.draggable = "true";
    newTicket.style.left = `${e.clientX}px`;
    newTicket.style.top = `${e.clientY}px`;
    container.appendChild(newTicket);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = "yellow";
  };

  const onDragLeave = (e) => {
    e.currentTarget.style.backgroundColor = "rgba(20,20,20,0.5)";
  };

  const onDrag = (e) => {
    const newTicket = document.querySelector(".newTicket");

    newTicket.style.opacity = "1";
    newTicket.style.position = "absolute";

    newTicket.style.left =
      e._reactName === "onDrag"
        ? `${e.clientX}px`
        : `${e.touches[0].clientX}px`;
    newTicket.style.top =
      e._reactName === "onDrag"
        ? `${window.scrollY + e.clientY}px`
        : `${window.scrollY + e.touches[0].clientY}px`;
    if (e._reactName === "onTouchMove") {
      onTouchOver(e.touches[0].clientX, e.touches[0].clientY);
      window.document.body.style.overflow = "hidden";
    }
  };

  const onTouchOver = (x, y) => {
    const trashBox = document.querySelector(".trash");
    const dropBox = document.querySelector(".dropBox");

    if (x <= trashBox.clientWidth && x >= 0)
      trashBox.style.backgroundColor = "yellow";
    else trashBox.style.backgroundColor = "rgba(20,20,20,0.5)";
    if (y <= dropBox.clientHeight && y >= 0)
      dropBox.style.backgroundColor = "yellow";
    else dropBox.style.backgroundColor = "rgba(20,20,20,0.5)";
  };

  const onDragend = async (e) => {
    const container = document.querySelector(".container");
    const newTicket = document.querySelector(".newTicket");
    const dropBox = document.querySelector(".dropBox");
    const trashBox = document.querySelector(".trash");

    if (e._reactName === "onTouchEnd") {
      window.document.body.style.overflow = "auto";
      // 만일  드롭존 구역에 있으면 기능 수행을 해줘야 한다.
      console.log(
        newTicket.getBoundingClientRect().left,
        newTicket.getBoundingClientRect().top,
        newTicket.getBoundingClientRect().width
      );
      const x =
        newTicket.getBoundingClientRect().left +
        newTicket.getBoundingClientRect().width / 2;
      const y = newTicket.getBoundingClientRect().top + 100;

      const rowId = document.querySelector(".newTicket").id;
      const numberId = parseInt(rowId.split("-")[0]);
      const type = rowId.split("-")[1];

      if (x <= trashBox.clientWidth && x >= 0) {
        //삭제기능
        const object = await storeService
          .collection(`mwFlix-${uid}`)
          .get(queryAllByAttribute);
        object.forEach((item) => {
          if (item.data().id === numberId) item.ref.delete();
        });
        Pop(numberId); //  state의 상태를 업그레이드 시켜준다.
      } else if (y <= dropBox.clientHeight && y >= 0) {
        //공유기능
        const [data] =
          type === "movie"
            ? movie.filter((item) => item.id === numberId)
            : drama.filter((item) => item.id === numberId);
        console.log(data);
        sendKakaoMessage(data);
      }
    }

    dropBox.style.zIndex = "0";
    dropBox.style.display = "none";

    trashBox.style.display = "none";
    container.removeChild(newTicket);
  };

  useEffect(() => {
    window.addEventListener("scroll", () => setScroll(window.scrollY));
    return () =>
      window.removeEventListener("scroll", () => setScroll(window.scrollY));
  }, []);

  useEffect(() => {
    if (!MyList.length) findData(); // 처음 로그인하고  화면들어올때만  셋팅을 해준다.
  }, []);

  useEffect(async () => {
    let testDrama = [];
    let testMovie = [];

    MyList.forEach((item) =>
      item.content === "movie"
        ? testMovie.push(parseInt(item.id))
        : testDrama.push(parseInt(item.id))
    );

    for (let i = 0; i < testMovie.length; i++) {
      const data = await moviesApi.detail(testMovie[i]);
      testMovie[i] = data.data;
    }

    for (let i = 0; i < testDrama.length; i++) {
      const data = await dramaApi.detail(testDrama[i]);
      testDrama[i] = data.data;
    }

    setMovie(testMovie);
    setDrama(testDrama);
  }, [MyList]);

  const logoutClick = async () => {
    await authService.signOut();
    logOut();
    window.location.href = "/";
  };

  return (
    <>
      <DropBox
        className="dropBox"
        droppable="true"
        draggable="true"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div>KaKaoTalk Share</div>
      </DropBox>
      <TrashBox
        height={document.body.offsetHeight}
        className="trash"
        droppable="true"
        onDragOver={onDragOver}
        onTouchMove={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <TrashIcon scrollHeight={scroll}>🗑</TrashIcon>
      </TrashBox>
      <Container className="container">
        <button onClick={logoutClick}>Log Out</button>
        <Wrapper>
          <h1>Movies</h1>
          {movie.length ? (
            <MovieWrapper>
              {movie.map((item) => (
                <Poster
                  draggable="true"
                  onDragStart={onDragStart}
                  onTouchStart={onDragStart}
                  onDragEnd={onDragend}
                  onTouchEnd={onDragend}
                  onDrag={onDrag}
                  onTouchMove={onDrag}
                  id={`${item.id}-movie`}
                >
                  <Link to={`/${item.id}/movie`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                      draggable="false"
                    />
                  </Link>
                  <div>{item.original_title}</div>
                </Poster>
              ))}
            </MovieWrapper>
          ) : (
            ""
          )}
          <FontAwesomeIcon
            id="left"
            icon={faChevronLeft}
            onClick={sliderFunc}
          ></FontAwesomeIcon>
          <FontAwesomeIcon
            id="right"
            icon={faChevronRight}
            onClick={sliderFunc}
          ></FontAwesomeIcon>
        </Wrapper>
        <Wrapper>
          <h1>Tvs</h1>
          <DramaWrapper>
            {drama.map((item) => (
              <Poster
                draggable="true"
                onDragStart={onDragStart}
                onTouchStart={onDragStart}
                onDragEnd={onDragend}
                onTouchEnd={onDragend}
                onDrag={onDrag}
                onTouchMove={onDrag}
                id={`${item.id}-tv`}
              >
                <Link to={`/${item.id}/movie`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    draggable="false"
                  />
                </Link>
                <div>{item.original_name}</div>
              </Poster>
            ))}
          </DramaWrapper>
          <FontAwesomeIcon
            id="left"
            icon={faChevronLeft}
            onClick={sliderFunc}
          ></FontAwesomeIcon>
          <FontAwesomeIcon
            id="right"
            icon={faChevronRight}
            onClick={sliderFunc}
          ></FontAwesomeIcon>
        </Wrapper>
        <SearchPage></SearchPage>
      </Container>
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  return { MyList: state.MyList, uid: state.User.user.uid };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    logOut: () => dispatch(userActionCreator.logout()),
    bunchPush: (data) => dispatch(myListActionCreator.dataBunchPush(data)),
    Pop: (id) => dispatch(myListActionCreator.dataPop(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPage);
