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
  margin-top: 60px;
  color: white;
  .newTicket {
    height: 100%;
    border: 1px solid green;
    transform: translate(-50%, -20%);
    opacity: 0;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 200px;
    gap: 30px;
    img {
      border: 1px solid red;
      width: 200px;
      height: 100%;
      object-fit: contain;
    }
  }
`;

const Wrapper = styled.section`
  width: 100%;
  position: relative;
  #left {
    position: absolute;
    top: 0;
    left: 45%;
    transform: translateX(-50%);
    border: 1px solid green;
    font-size: 50px;
    width: 50px;
  }
  #right {
    position: absolute;
    font-size: 50px;
    width: 50px;
    border: 1px solid green;
    top: 0;
    right: 45%;
    transform: translateX(50%);
    margin-left: 20px;
  }
`;

const MovieWrapper = styled.div`
  display: flex;

  overflow-x: auto;
  scroll-behavior: smooth;
`;
const DramaWrapper = styled.div`
  display: flex;
  width: 100%;
  overflow: auto;
`;
const Poster = styled.div`
  height: 100%;
  border: 1px solid green;
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 30px;
  img {
    border: 1px solid red;
    width: 200px;
    height: 100%;
    object-fit: contain;
  }
`;

const DropBox = styled.div`
  width: 100%;
  height: 100px;
  background-color: white;
`;

const MyPage = ({ logOut, bunchPush, MyList, uid }) => {
  // 물론  데이터를 데이터베이스에서 바로 가져오는게 더유용하다 생각하지만 리덕스를 연습하기위해  리덕스
  // state를 써서 데이터를 관리하려고 함
  const [movie, setMovie] = useState([]);
  const [drama, setDrama] = useState([]);
  const poster = useRef();

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

  const onDrop = (e) => {
    console.log("떨어트리셨소");
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragStart = (e) => {
    const container = document.querySelector(".container");

    const { currentTarget } = e;
    const newTicket = document.createElement("div");
    newTicket.className = "newTicket";
    newTicket.innerHTML = currentTarget.innerHTML;
    newTicket.draggable = "true";
    newTicket.style.left = `${e.clientX}px`;
    newTicket.style.top = `${e.clientY}px`;
    container.appendChild(newTicket);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    console.log("move");
  };
  const onDrag = (e) => {
    const newTicket = document.querySelector(".newTicket");
    newTicket.style.opacity = "1";
    newTicket.style.position = "absolute";
    newTicket.style.left = `${e.clientX}px`;
    newTicket.style.top = `${e.clientY}px`;
    //drop Box 경계에 닿으면  색깔을 바꿔주고  공유 기능을 넣어줘야 한다.
  };

  const onDragend = (e) => {
    const container = document.querySelector(".container");
    const newTicket = document.querySelector(".newTicket");
    //newTicket.style.position = "absolute";
    //newTicket.style.left = `${e.clientX}px`;
    //newTicket.style.top = `${e.clientY}px`;
    container.removeChild(newTicket);

    //newTicket.style.left = `${e.clientX}px`;
    //newTicket.style.top = `${e.clientY}px`;
  };

  useEffect(() => {
    if (!MyList.length) findData(); // 처음 로그인하고  화면들어올때만  셋팅을 해준다.
  }, []);

  useEffect(async () => {
    let testDrama = [];
    let testMovie = [];
    console.log(MyList);
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
      <DropBox></DropBox>
      <Container
        draggable="true"
        className="container"
        onDrop={onDrop}
        onDragOver={onDragOver}
        droppable="true"
      >
        <button onClick={logoutClick}>Log Out</button>
        <Wrapper>
          <h1>Movies</h1>
          {movie.length ? (
            <MovieWrapper>
              {movie.map((item) => (
                <Poster
                  draggable="true"
                  onDragStart={onDragStart}
                  onDragEnd={onDragend}
                  onDrag={onDrag}
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
              <Poster>
                <Link to={`/${item.id}/movie`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPage);
