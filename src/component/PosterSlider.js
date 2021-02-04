import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { dramaApi, moviesApi } from "../api";
import { queryAllByAttribute } from "@testing-library/react";
import { storeService } from "../fbase";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { myListActionCreator } from "../store/modules/MyList";
import { errorACtionCreator } from "../store/modules/Error";

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
    opacity: ${(props) => (props.isMobile ? "1" : "0")};
  }
  &#right {
    right: 0;
  }
`;
const MovieWrapper = styled.div`
  position: relative;
  margin-right: 25px;
  button {
    width: 50px;
  }
`;

const SLink = styled(Link)``;

const PosterSlider = ({
  data,
  isMobile,
  MyList,
  listPush,
  bunchPush,
  uid,
  errorText,
  type,
}) => {
  // 데이터, isMobile,bringVideo,setClearTime,handleShareBtn,handleSlider
  const [testTimer, setTimer] = useState(null);

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

  const hoverVideo = (dataArray, videoId, name) => {
    const hoverBox = document.querySelector(".hoverBox");
    let videoWrapper;
    let title;
    if (hoverBox) {
      if (dataArray.length !== 0) {
        videoWrapper = document.createElement("div");
        videoWrapper.className = "videoWrapper";
        const video = document.createElement("iframe");
        video.src = `https://www.youtube.com/embed/${dataArray[0].key}?ps=blogger&showinfo=0&cc_load_policy=0&iv_load_policy=3&vq=hd720&rel=0&fs=0&control=0&autoplay=1&mute=1&amp;loop=1;playlist=${dataArray[0].key}`;
        video.frameborder = "0";
        video.width = "100%";
        video.height = "100%";
        video.allow =
          "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";

        videoWrapper.appendChild(video);
        title = document.createElement("h4");

        title.innerText =
          name.length < 20 ? name : name.substring(0, 20) + "...";
      } else {
        // 비디오가 없을 경우  이미지 넣어주기
        videoWrapper = document.createElement("img");
        videoWrapper.className = "videoWrapper";

        videoWrapper.src =
          "https://usecloud.s3-ap-northeast-1.amazonaws.com/%EC%96%B4%EB%AA%BD%EC%96%B4%EC%8A%A4.PNG";
      }
      // 제목이랑  상세정보 보기 버튼이 필요하다.

      const btnWrapper = document.createElement("div");

      const shareBtn = document.createElement("button");
      shareBtn.innerText = "+";
      shareBtn.addEventListener("click", handleShareBtn);
      const link = document.createElement("a");
      link.href = `/#/${videoId}/${type}`;
      link.innerText = "상세정보";
      btnWrapper.appendChild(shareBtn);
      btnWrapper.appendChild(link);
      hoverBox.appendChild(videoWrapper);
      if (title) hoverBox.appendChild(title);
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
        data: {
          videos: { results: videos },
          id: videoId,
          original_title: movieName,
          original_name: dramaName,
        },
      } =
        type === "movie"
          ? await moviesApi.detail(parseInt(id))
          : await dramaApi.detail(parseInt(id));

      const hoverBox = document.createElement("div");
      hoverBox.className = "hoverBox";
      hoverBox.id = id;
      hoverBox.style.position = "absolute";
      hoverBox.style.top = String(where.y + window.scrollY) + "px";
      hoverBox.style.left = String(where.x) + "px";

      hoverBox.addEventListener("mouseleave", setOriginal);
      containerBox.appendChild(hoverBox);
      hoverVideo(videos, videoId, type === "movie" ? movieName : dramaName);
    }
  };

  const bringVideo = async (e) => {
    const {
      currentTarget: { id },
    } = e;

    const where = e.currentTarget.getBoundingClientRect();

    //timerSetting = setTimeout(() => createBox(where), 1200); // 2초전에 마우스가 나가면 clearTimeout을 해줘야 한다.
    setTimer(setTimeout(() => createBox(where, id), 1200)); // 2초전에 마우스가 나가면 clearTimeout을 해줘야 한다.

    // 비디오를 찾아서 화면에 넣어주어야 한다.
  };

  // +버튼을 누르면  내 목록에 추가한다. // 단 내목록에 추가할때  id만 추가하고  내 목록페이지에 갔을때  api로 찾아준다.
  const handleShareBtn = async (e) => {
    if (isMobile) e.stopPropagation();
    const {
      currentTarget: {
        parentNode: {
          parentNode: { id: notebookId },
        },
      },
    } = e;
    const id = isMobile ? e.currentTarget.id : notebookId;
    // 이미 저장되있는지 판별해야 한다.
    let save = 1;
    const test = await storeService
      .collection(`mwFlix-${uid}`)
      .get(queryAllByAttribute);

    test.forEach((item) =>
      parseInt(item.data().id) === parseInt(id) ? (save = 0) : (save = 1)
    ); // 아이다가 같으면 save해주지 않는다.
    if (save) {
      const data = { id: parseInt(id), creator: uid, type: "movie" };
      await storeService.collection(`mwFlix-${uid}`).add(data);
      listPush(parseInt(id), type);
    } else {
      errorText(`이미 저장되어있는 ${type}입니다.`);
    }
  };

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

  return (
    <>
      <MoviesWrapper>
        {data.length
          ? data.map((item, index) =>
              index > 9 ? (
                <MovieWrapper
                  key={item.id}
                  id={item.id}
                  onMouseEnter={isMobile ? "" : bringVideo}
                  onMouseLeave={setClearTime}
                >
                  <SLink key={item.id} id={item.id} to={`/${item.id}/${type}`}>
                    <img
                      alt=""
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    />
                  </SLink>
                  {isMobile ? (
                    <button id={item.id} onClick={handleShareBtn}>
                      Store
                    </button>
                  ) : (
                    ""
                  )}
                </MovieWrapper>
              ) : (
                ""
              )
            )
          : ""}
        {data.length
          ? data.map((item) => (
              <MovieWrapper
                key={item.id}
                id={item.id}
                onMouseEnter={isMobile ? "" : bringVideo}
                onMouseLeave={setClearTime}
              >
                <SLink key={item.id} id={item.id} to={`/${item.id}/${type}`}>
                  <img
                    alt=""
                    src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  />
                </SLink>
                {isMobile ? (
                  <button id={item.id} onClick={handleShareBtn}>
                    Store
                  </button>
                ) : (
                  ""
                )}
              </MovieWrapper>
            ))
          : ""}
        {data.length
          ? data.map((item, index) =>
              index < 10 ? (
                <MovieWrapper
                  key={item.id}
                  id={item.id}
                  onMouseEnter={isMobile ? "" : bringVideo}
                  onMouseLeave={setClearTime}
                >
                  <SLink key={item.id} id={item.id} to={`/${item.id}/${type}`}>
                    <img
                      alt=""
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    />
                  </SLink>
                  {isMobile ? (
                    <button id={item.id} onClick={handleShareBtn}>
                      Store
                    </button>
                  ) : (
                    ""
                  )}
                </MovieWrapper>
              ) : (
                ""
              )
            )
          : ""}
      </MoviesWrapper>
      <IconWrapper id="left" isMobile={isMobile} onClick={handleSlider}>
        <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>
      </IconWrapper>
      <IconWrapper id="right" isMobile={isMobile} onClick={handleSlider}>
        <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
      </IconWrapper>
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  return { MyList: state.MyList, uid: state.User.user.uid };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    listPush: (id, content) =>
      dispatch(myListActionCreator.dataPush(id, content)),
    bunchPush: (data) => dispatch(myListActionCreator.dataBunchPush(data)),
    errorText: (text) => dispatch(errorACtionCreator.error(text)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PosterSlider);

PosterSlider.propTypes = {
  data: PropTypes.array,
  isMobile: PropTypes.bool,
  MyList: PropTypes.array,
  listPush: PropTypes.func,
  bunchPush: PropTypes.func,
  uid: PropTypes.string,
  errorText: PropTypes.func,
  type: PropTypes.string,
};
