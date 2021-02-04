import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { storeService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { queryAllByAttribute } from "@testing-library/react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { myListActionCreator } from "../store/modules/MyList";

const Wrapper = styled.section`
  width: 100%;
  position: relative;
  margin-bottom: 20px;
  //padding: 10px;
  h1 {
    font-size: 30px;
    padding: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
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
  width: 100%;
  height: 70vh;
  overflow: auto;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const Poster = styled.div`
  // height: 100%;
  margin-right: 10px;
  width: 200px;
  display: grid;
  grid-template-rows: 1fr 1fr;
  justify-items: center;
  padding: 5px;
  gap: 30px;

  background-color: rgba(232, 65, 24, 1);

  img {
    max-width: 200px;
    max-height: 200px;
    object-fit: cover;
  }
`;

const MyPagePoster = ({ title, sendKakaoMessage, movie, drama, uid, Pop }) => {
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

  const onDragend = async (e) => {
    const container = document.querySelector(".container");
    const newTicket = document.querySelector(".newTicket");
    const dropBox = document.querySelector(".dropBox");
    const trashBox = document.querySelector(".trash");

    if (e._reactName === "onTouchEnd") {
      window.document.body.style.overflow = "auto";
      // 만일  드롭존 구역에 있으면 기능 수행을 해줘야 한다.

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

        sendKakaoMessage(data);
      }
    }

    dropBox.style.zIndex = "0";
    dropBox.style.display = "none";

    trashBox.style.display = "none";
    container.removeChild(newTicket);
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

  return (
    <Wrapper>
      <h1>{title}</h1>
      {(title === "Movies" ? movie : drama).length ? (
        <MovieWrapper>
          {(title === "Movies" ? movie : drama).map((item) => (
            <Poster
              key={item.id}
              onDragStart={onDragStart}
              onTouchStart={onDragStart}
              onDragEnd={onDragend}
              onTouchEnd={onDragend}
              onDrag={onDrag}
              onTouchMove={onDrag}
              id={`${item.id}-${title === "Movies" ? "movie" : "tv"}`}
            >
              <Link
                key={item.id}
                to={`/${item.id}/${title === "Movies" ? "movie" : "tv"}`}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  draggable="false"
                  alt=""
                />
              </Link>
              <div>
                {title === "Movies" ? item.original_title : item.original_name}
              </div>
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
  );
};
const mapStateToProps = (state, ownProps) => {
  return { uid: state.User.user.uid };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    Pop: (id) => dispatch(myListActionCreator.dataPop(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPagePoster);

MyPagePoster.propTypes = {
  title: PropTypes.string,
  sendKakaoMessage: PropTypes.func,
  movie: PropTypes.array,
  drama: PropTypes.array,
  uid: PropTypes.string,
  Pop: PropTypes.func,
};
