import React, { useEffect, useState } from "react";
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
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  margin-top: 60px;
  color: white;
`;

const Wrapper = styled.section``;

const MovieWrapper = styled.div`
  display: flex;
  width: 100%;
  overflow: auto;
`;
const DramaWrapper = styled.div`
  display: flex;
  width: 100%;
  overflow: auto;
`;
const Poster = styled.div``;

const MyPage = ({ logOut, bunchPush, MyList, uid }) => {
  // 물론  데이터를 데이터베이스에서 바로 가져오는게 더유용하다 생각하지만 리덕스를 연습하기위해  리덕스
  // state를 써서 데이터를 관리하려고 함
  const [movie, setMovie] = useState([]);
  const [drama, setDrama] = useState([]);

  const sliderFunc = (e) => {
    const {
      currentTarget: { id, previousSibling },
    } = e;
    if (id === "left") {
      console.log(previousSibling.offsetWidth);
      console.log(previousSibling.scrollWidth);
    } else {
      // 여긴 previousSibling.previousSIbling 을 써줘야 한다.
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
      <Container>
        <button onClick={logoutClick}>Log Out</button>
        <Wrapper>
          <h1>Movies</h1>
          {movie.length ? (
            <MovieWrapper>
              {movie.map((item) => (
                <Poster>
                  <Link to={`/${item.id}/movie`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    />
                  </Link>
                  <div>{item.original_title}</div>
                  <button>공유하기</button>
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
                <button>공유하기</button>
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
