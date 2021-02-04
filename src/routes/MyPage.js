import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { authService, storeService } from "../fbase";
import { connect } from "react-redux";
import { userActionCreator } from "../store/modules/User";
import { dramaApi, moviesApi } from "../api";
import SearchPage from "../component/SearchPage";
import { myListActionCreator } from "../store/modules/MyList";
import { queryAllByAttribute } from "@testing-library/react";

import MyPagePoster from "../component/MyPagePoster";

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
      height: 50px;
      background-color: rgba(15, 15, 15, 0.5);
      border-radius: 10px;
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

const AlarmBox = styled.div`
  border: 1px solid white;
  position: absolute;
  top: 105px;
  left: 50%;
  width: 50vw;
  padding: 10px;
  text-align: center;
  transform: translate(-50%, -50%);
`;

const MyPage = ({ logOut, bunchPush, MyList, uid, Pop }) => {
  // 물론  데이터를 데이터베이스에서 바로 가져오는게 더유용하다 생각하지만 리덕스를 연습하기위해  리덕스
  // state를 써서 데이터를 관리하려고 함
  const [movie, setMovie] = useState([]);
  const [drama, setDrama] = useState([]);
  const [scroll, setScroll] = useState(window.scrollY);

  const { Kakao } = window;

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
    e.currentTarget.style.backgroundColor = "rgba(20,20,20,0.5)";

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

  const onDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = "yellow";
  };

  const onDragLeave = (e) => {
    e.currentTarget.style.backgroundColor = "rgba(20,20,20,0.5)";
  };

  const findData = useCallback(async () => {
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
  }, [bunchPush, uid]);

  const getData = useCallback(async () => {
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

  const windowScroll = () => {
    setScroll(window.scrollY);
  };
  useEffect(() => {
    window.addEventListener("scroll", windowScroll);
    return () => window.removeEventListener("scroll", windowScroll);
  }, []);

  useEffect(() => {
    if (!MyList.length) {
      findData(); // 처음 로그인하고  화면들어올때만  셋팅을 해준다.
    } else {
      getData();
    }
  }, [getData, findData, MyList]);

  const logoutClick = async () => {
    await authService.signOut();
    logOut();
    window.location.href = "/";
  };

  return movie.length || drama.length ? (
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
        <>
          {movie.length ? (
            <MyPagePoster
              title="Movies"
              sendKakaoMessage={sendKakaoMessage}
              movie={movie}
              drama={drama}
              draggable="true"
            ></MyPagePoster>
          ) : (
            ""
          )}
          {drama.length ? (
            <MyPagePoster
              title="Tvs"
              sendKakaoMessage={sendKakaoMessage}
              movie={movie}
              drama={drama}
              draggable="true"
            ></MyPagePoster>
          ) : (
            ""
          )}
        </>
        <SearchPage></SearchPage>
        <AlarmBox>
          <p>
            영화를 공유하고 싶거나 삭제하고 싶으시면 영화표의 포스터사진을 잡고
            드래그를 해주세요
          </p>
        </AlarmBox>
      </Container>
    </>
  ) : (
    ""
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

MyPage.propTypes = {
  logOut: PropTypes.func,
  bunchPush: PropTypes.func,
  MyList: PropTypes.array,
  uid: PropTypes.string,
  Pop: PropTypes.func,
};
