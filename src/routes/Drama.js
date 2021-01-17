import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { dramaApi } from "../api";
import { Link } from "react-router-dom";
import SearchPage from "../component/SearchPage";

const Container = styled.div``;
const HeaderImage = styled.div``;
const ContentWrapper = styled.div``;
const SectionWrapper = styled.section``;
const DramaWrapper = styled.div`
  img {
    width: 70px;
    height: 100px;
  }
`;
const SLink = styled(Link)``;

const Drama = () => {
  const [data, setData] = useState({});

  useEffect(async () => {
    const newData = {};
    const {
      data: { results: popular },
    } = await dramaApi.popular();

    const {
      data: { results: onAir },
    } = await dramaApi.onAir();

    const {
      data: { results: airToday },
    } = await dramaApi.airToday();

    const { data: latest } = await dramaApi.lates();
    setData({ popular, onAir, airToday, latest });
  }, []);

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
      <iframe
        width="560"
        height="315"
        src="https://www.youtube.com/embed/SUXWAEX2jlg"
        frameborder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
      <ContentWrapper>
        <SectionWrapper>
          <h1>Popular</h1>
          <DramaWrapper>
            {data["popular"].map((item) => (
              <SLink to={`/${item.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                />
              </SLink>
            ))}
          </DramaWrapper>
        </SectionWrapper>
        <SectionWrapper>
          <h1>onAir</h1>
          <DramaWrapper>
            {data["onAir"].map((item) => (
              <SLink to={`/${item.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                />
              </SLink>
            ))}
          </DramaWrapper>
        </SectionWrapper>
        <SectionWrapper>
          <h1>air-Today</h1>
          <DramaWrapper>
            {data["airToday"].map((item) => (
              <SLink to={`/${item.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                />
              </SLink>
            ))}
          </DramaWrapper>
        </SectionWrapper>
      </ContentWrapper>
      <SearchPage></SearchPage>
    </Container>
  ) : (
    "Loading..."
  );
};
export default Drama;
