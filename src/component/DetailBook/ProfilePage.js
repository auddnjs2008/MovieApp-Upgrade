import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

const ItemProfile = styled.section`
  position: absolute;
  background-image: ${(props) => `url(${props.src})`};
  //background-size: contain;
  background-position: center center;

  top: 0;
  display: flex;
  // width: 47%;
  height: 95%;
  justify-content: center;
  align-items: center;
  .profile {
    background-color: rgba(15, 15, 15, 0.5);
    color: white;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    h1 {
      font-size: 25px;
      font-weight: 600;
      text-align: center;
      margin-bottom: 10px;
      text-shadow: 5px 2px 2px black;
    }
  }
  .backPage {
    padding: 20px;
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: rgba(15, 15, 15, 0.5);
    color: white;

    .semiInfo {
      height: 100%;
      display: grid;
      grid-template-rows: repeat(4, 1fr);
      span {
        h5 {
          margin-bottom: 20px;
          font-size: 20px;
          font-weight: 600;
        }
      }

      button {
        justify-self: center;
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
    }
  }
`;

const BackPage = styled.div`
  display: none;
`;

const ProfilePage = ({ data }) => {
  return (
    <ItemProfile
      src={`https://image.tmdb.org/t/p/w300${data["results"].poster_path}`}
    >
      <div className="profile">
        <h1>
          {data.type === "movie"
            ? data["results"].original_title
            : data["results"].original_name}
        </h1>
        {/* <img
            src={`https://image.tmdb.org/t/p/w300${data["results"].poster_path}`}
          /> */}
      </div>
      <BackPage className="backPage">
        <div className="semiInfo">
          <span>
            <h5>
              {data["results"].release_date ? "Release" : "First_Air_Date"}
            </h5>
            {data["results"].release_date
              ? data["results"].release_date
              : data["results"].first_air_date}
          </span>
          <span>
            <h5>Genres</h5>
            {data["results"].genres.map((item) => item.name).join("/")}
          </span>
          <span>
            <h5>Grade</h5>⭐{data["results"].vote_average}
          </span>
          <a
            href={`https://www.imdb.com/title/${data["results"].imdb_id}`}
            target="_blank"
            rel="noreferrer"
          >
            <button>
              IMDB <br /> Site
            </button>
          </a>
        </div>
      </BackPage>
    </ItemProfile>
  );
};

export default ProfilePage;

ProfilePage.propTypes = {
  data: PropTypes.object,
};
