import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { moviesApi } from "../api";
import { Link } from "react-router-dom";
import SearchPage from "../component/SearchPage";

const Container = styled.div``;
const HeaderImage = styled.div``;
const ContentWrapper = styled.div``;
const SectionWrapper = styled.section``;
const MoviesWrapper = styled.div`
  img {
    width: 70px;
    height: 100px;
  }
`;

const SLink = styled(Link)``;

const Movie = () => {
  const [data, setData] = useState({}); // popular, nowPlaying upComing  -> data.results에 존재

  useEffect(async () => {
    const newData = {};
    const {
      data: { results: popular },
    } = await moviesApi.popular();
    const {
      data: { results: nowPlaying },
    } = await moviesApi.nowPlaying();
    const {
      data: { results: upComing },
    } = await moviesApi.upComing();
    const { data: latest } = await moviesApi.latest();

    setData({ popular, nowPlaying, upComing, latest });
  }, []);
  console.log(data);
  return Object.keys(data).length === 4 ? (
    <Container>
      <HeaderImage>
        <img
          src={
            data["latest"].poster_path
              ? `https://image.tmdb.org/t/p/w300${data["latest"].poster_path}`
              : "https://usecloud.s3-ap-northeast-1.amazonaws.com/kakaoMapIcon/movie.jpg"
          }
        ></img>
      </HeaderImage>
      <ContentWrapper>
        <SectionWrapper>
          <h1>Popular Movie</h1>
          <MoviesWrapper>
            {data !== {}
              ? data["popular"].map((item) => (
                  <SLink to={`/${item.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    />
                  </SLink>
                ))
              : ""}
          </MoviesWrapper>
        </SectionWrapper>
        <SectionWrapper>
          <h1>Now Playing</h1>
          <MoviesWrapper>
            {data !== {}
              ? data["nowPlaying"].map((item) => (
                  <SLink to={`/${item.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    />
                  </SLink>
                ))
              : ""}
          </MoviesWrapper>
        </SectionWrapper>
        <SectionWrapper>
          <h1>UpComing</h1>
          <MoviesWrapper>
            {data !== {}
              ? data["upComing"].map((item) => (
                  <SLink to={`/${item.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    />
                  </SLink>
                ))
              : ""}
          </MoviesWrapper>
        </SectionWrapper>
      </ContentWrapper>
      <SearchPage></SearchPage>
    </Container>
  ) : (
    "Loading.."
  );
};

export default Movie;
