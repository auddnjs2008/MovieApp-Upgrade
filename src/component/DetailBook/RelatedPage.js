import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ItemRelated = styled.section`
  position: absolute;
  top: 0;
  //width: 47%;
  height: 95%;
  h1 {
    margin-top: 15px;
    text-align: center;
    font-size: 25px;
    font-weight: 600;
  }
  .backPage {
    padding: 10px;
    h1 {
      margin-bottom: 30px;
    }
    .companyWrapper {
      color: white;
      overflow: auto;
      height: 70vh;
      display: grid;
      justify-items: center;
      align-items: center;
      grid-auto-rows: 35vh;
      gap: 10px;
      .company {
        background-color: rgba(64, 115, 158, 1);
        padding: 30px;

        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: 4fr 1fr 1fr;
        justify-items: center;
        align-items: center;
        img {
          max-width: 130px;
          max-height: 130px;
          width: auto;
          height: auto;
        }
      }
    }
  }
`;
const RelatedWrapper = styled.div`
  div.relatedBox {
    margin-top: 30px;
    display: grid;
    grid-auto-rows: 1fr;
    row-gap: 10px;
    padding: 10px;
    height: 70vh;
    overflow: auto;

    div.itemWrapper {
      display: grid;
      grid-template-columns: 100px 1fr;
      background-color: rgba(64, 115, 158, 0.6);
      padding: 10px;
      border-radius: 10px;
      gap: 10px;
      &:hover {
        background-color: rgba(15, 15, 15, 0.8);
        color: white;
      }
      img {
        width: 100px;
        height: 130px;
      }
      div.relatedContent {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        h2 {
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
  }
  .noRelative {
    margin: 0 auto;
    margin-top: 70px;
    position: relative;

    width: 200px;
    height: 200px;
    justify-self: center;
    img {
      max-width: 200px;
      max-height: 200px;
      object-fit: contain;
    }
    div {
      position: absolute;
      top: 0;
      left: 120px;
      border: 1px solid black;
      background-color: rgba(64, 115, 158, 1);
      color: white;
      border-radius: 20px;
      border-bottom-left-radius: 0;
      width: 200px;
      height: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;
const BackPage = styled.div`
  display: none;
`;

const RelatedPage = ({ data }) => {
  return (
    <ItemRelated>
      <RelatedWrapper>
        <h1>Related</h1>
        {data["similar"].results.length ? (
          <div className="relatedBox">
            {data["similar"].results.map((item) => (
              <Link
                key={item.id}
                to={`/${item.id}/${data.type}`}
                onClick={() => setTimeout(() => window.location.reload(), 50)}
              >
                <div className="itemWrapper">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                    alt=""
                  />
                  <div className="relatedContent">
                    <h2>
                      {item.original_name
                        ? item.original_name
                        : item.original_title}
                    </h2>
                    <div>⭐{item.vote_average}</div>
                    <div>{item.release_date}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="noRelative">
            <img
              src="https://usecloud.s3-ap-northeast-1.amazonaws.com/%EC%96%B4%EB%AA%BD%EC%96%B4%EC%8A%A43.PNG"
              alt=""
            />
            <div>There are no Information</div>
          </div>
        )}
      </RelatedWrapper>
      <BackPage className="backPage">
        <h1>Production Company</h1>
        <div className="companyWrapper">
          {data.results.production_companies.length
            ? data.results.production_companies.map((item) =>
                item.logo_path ? (
                  <div className="company" key={item.id}>
                    <img
                      src={`https://image.tmdb.org/t/p/w300${item.logo_path}`}
                      alt=""
                    />
                    <div>{item.name}</div>
                    <div>{item.origin_country}</div>
                  </div>
                ) : (
                  ""
                )
              )
            : ""}
        </div>
      </BackPage>
    </ItemRelated>
  );
};

export default RelatedPage;

RelatedPage.propTypes = {
  data: PropTypes.object,
};
