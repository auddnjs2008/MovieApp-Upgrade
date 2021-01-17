import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { connect } from "react-redux";
import { dramaApi, moviesApi } from "../api";

const Container = styled.div`
  height: 100%;
  width: 100vw;
  background-color: white;
  position: absolute;
  top: 60px;
`;
const MovieSearchWrapper = styled.section`
  h1 {
    font-size: 20px;
  }
  margin-bottom: 50px;
`;
const DramaSearchWrapper = styled.section`
  h1 {
    font-size: 20px;
  }
`;
const PosterWrapper = styled.ul`
  display: flex;
`;

const Poster = styled.li`
  img {
    width: 70px;
    height: 100px;
  }
`;

const SearchPage = ({ search }) => {
  const [tv, setDrama] = useState([]);
  const [mov, setMovie] = useState([]);

  console.log("영화", mov);
  console.log("드라마", tv);
  useEffect(async () => {
    const {
      data: { results: searchDrama },
    } = await dramaApi.search(search);
    const {
      data: { results: searchMovie },
    } = await moviesApi.search(search);
    setDrama(searchDrama);
    setMovie(searchMovie);
  }, [search]);

  return search !== "" ? (
    <Container>
      <MovieSearchWrapper>
        <h1>Movie</h1>
        <PosterWrapper>
          {mov && mov.length !== 0
            ? mov.map((item) => (
                <Poster>
                  <img
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                        : "https://usecloud.s3-ap-northeast-1.amazonaws.com/kakaoMapIcon/movie.jpg"
                    }
                  />
                </Poster>
              ))
            : ""}
        </PosterWrapper>
      </MovieSearchWrapper>

      <DramaSearchWrapper>
        <h1>Drama</h1>
        <PosterWrapper>
          {tv && tv.length !== 0
            ? tv.map((item) => (
                <Poster>
                  <img
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                        : "https://usecloud.s3-ap-northeast-1.amazonaws.com/kakaoMapIcon/movie.jpg"
                    }
                  />
                </Poster>
              ))
            : ""}
        </PosterWrapper>
      </DramaSearchWrapper>
    </Container>
  ) : (
    ""
  );
};

const mapStateToProps = (state, ownProps) => {
  return { search: state.Search };
};

export default connect(mapStateToProps, null)(SearchPage);
