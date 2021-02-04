import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import { dramaApi, moviesApi } from "../api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { searchActionCreator } from "../store/modules/Search";
import { Link } from "react-router-dom";

const Container = styled.div`
  height: 90vh;
  width: 90vw;
  background-color: rgba(149, 175, 192, 1);
  border-radius: 20px;
  padding: 20px;
  z-index: 100;
  position: absolute;
  top: ${(props) => `${props.scroll + 40}px`};
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: 90vw;
  justify-items: center;
  justify-content: center;
  @keyframes SearchMove {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  animation: SearchMove 0.3s linear forwards;
`;
const MovieSearchWrapper = styled.section`
  text-align: center;
  width: 80%;

  h1 {
    font-size: 30px;
    font-weight: 600;
    margin-bottom: 20px;
  }
  margin-bottom: 50px;
`;
const DramaSearchWrapper = styled.section`
  width: 80%;
  text-align: center;
  align-self: start;

  h1 {
    font-size: 30px;
    font-weight: 600;
    margin-bottom: 20px;
    margin-top: 5px;
  }
  margin-bottom: 50px;
`;
const PosterWrapper = styled.ul`
  display: flex;
  width: 100%;
  overflow: auto;
  scroll-behavior: smooth;
  margin-bottom: 0px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Poster = styled.li`
  margin-right: 25px;
  span {
    font-size: 10px;
    font-weight: 600;
  }
  img {
    width: 90px;
    height: 100px;
    object-fit: contain;
  }
`;
const IconWrapper = styled.div`
  #left {
    margin-right: 10px;
  }
  #left,
  #right {
    font-size: 20px;
  }
`;

const CloseWrapper = styled.div`
  position: absolute;
  font-size: 30px;
  top: 10px;
  right: 30px;
  &:active {
    transform: scale(0.95, 0.95);
  }
`;

const SearchPage = ({ search, noSearch }) => {
  const [tv, setDrama] = useState([]);
  const [mov, setMovie] = useState([]);
  const [scroll, setScroll] = useState(parseInt(window.scrollY));

  const movieSearchScroll = (e) => {
    const {
      currentTarget: { id },
    } = e;
    const sliderBox = document.querySelector(".movieContainer");

    if (id === "left") {
      sliderBox.scrollLeft = sliderBox.scrollLeft
        ? sliderBox.scrollLeft - sliderBox.clientWidth
        : 0;
    } else {
      sliderBox.scrollLeft =
        sliderBox.scrollLeft + sliderBox.clientWidth >= sliderBox.scrollWidth
          ? sliderBox.scrollLeft
          : sliderBox.scrollLeft + sliderBox.clientWidth;
    }
  };

  const dramaSearchScroll = (e) => {
    const {
      currentTarget: { id },
    } = e;
    const sliderBox = document.querySelector(".tvContainer");

    if (id === "left") {
      sliderBox.scrollLeft = sliderBox.scrollLeft
        ? sliderBox.scrollLeft - sliderBox.clientWidth
        : 0;
    } else {
      sliderBox.scrollLeft =
        sliderBox.scrollLeft + sliderBox.clientWidth >= sliderBox.scrollWidth
          ? sliderBox.scrollLeft
          : sliderBox.scrollLeft + sliderBox.clientWidth;
    }
  };

  const closeBtnClick = (e) => {
    //검색창 검색어를 클린해준다.
    noSearch();
    const searchInput = document.querySelector(".searchInput");
    searchInput.value = "";
  };

  const getData = useCallback(async () => {
    if (search !== "") {
      const {
        data: { results: searchDrama },
      } = await dramaApi.search(search);
      const {
        data: { results: searchMovie },
      } = await moviesApi.search(search);

      setDrama(searchDrama);
      setMovie(searchMovie);
    }
  }, [search]);

  useEffect(() => {
    window.addEventListener("scroll", () =>
      setScroll(parseInt(window.scrollY))
    );
    return () => {
      window.removeEventListener("scroll", () =>
        setScroll(parseInt(window.scrollY))
      );
    };
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  return search !== "" ? (
    <Container scroll={scroll}>
      <MovieSearchWrapper>
        <h1>Movie</h1>
        <PosterWrapper className="movieContainer">
          {mov && mov.length !== 0
            ? mov.map((item) => (
                <Link
                  key={item.id}
                  to={`/${item.id}/movie`}
                  onClick={() => setTimeout(() => window.location.reload(), 50)}
                >
                  <Poster>
                    <img
                      alt=""
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                          : "https://usecloud.s3-ap-northeast-1.amazonaws.com/kakaoMapIcon/movie.jpg"
                      }
                    />
                    <span>{item.original_title}</span>
                  </Poster>
                </Link>
              ))
            : ""}
        </PosterWrapper>
        <IconWrapper>
          <FontAwesomeIcon
            icon={faChevronLeft}
            id="left"
            onClick={movieSearchScroll}
          ></FontAwesomeIcon>
          <FontAwesomeIcon
            icon={faChevronRight}
            id="right"
            onClick={movieSearchScroll}
          ></FontAwesomeIcon>
        </IconWrapper>
      </MovieSearchWrapper>

      <DramaSearchWrapper>
        <IconWrapper>
          <FontAwesomeIcon
            icon={faChevronLeft}
            id="left"
            onClick={dramaSearchScroll}
          ></FontAwesomeIcon>
          <FontAwesomeIcon
            icon={faChevronRight}
            id="right"
            onClick={dramaSearchScroll}
          ></FontAwesomeIcon>
        </IconWrapper>
        <h1>Drama</h1>
        <PosterWrapper className="tvContainer">
          {tv && tv.length !== 0
            ? tv.map((item) => (
                <Link
                  key={item.id}
                  to={`/${item.id}/tv`}
                  onClick={() => setTimeout(() => window.location.reload(), 50)}
                >
                  <Poster>
                    <img
                      alt=""
                      src={
                        item.poster_path
                          ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                          : "https://usecloud.s3-ap-northeast-1.amazonaws.com/kakaoMapIcon/movie.jpg"
                      }
                    />
                    <span>{item.name}</span>
                  </Poster>
                </Link>
              ))
            : ""}
        </PosterWrapper>
      </DramaSearchWrapper>
      <CloseWrapper>
        <FontAwesomeIcon
          icon={faTimes}
          onClick={closeBtnClick}
        ></FontAwesomeIcon>
      </CloseWrapper>
    </Container>
  ) : (
    ""
  );
};

const mapStateToProps = (state, ownProps) => {
  return { search: state.Search };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return { noSearch: () => dispatch(searchActionCreator.noSearch()) };
};
export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);

SearchPage.propTypes = {
  search: PropTypes.string,
  noSearch: PropTypes.func,
};
