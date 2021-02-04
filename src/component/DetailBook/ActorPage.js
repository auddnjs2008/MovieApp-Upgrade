import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ItemActor = styled.section`
  position: absolute;
  top: 0;
  //width: 47%;
  height: 95%;
  .backPage {
    h1 {
      margin-top: 15px;
      text-align: center;
      font-size: 25px;
      font-weight: 600;
    }
    .reviewWrapper {
      margin-top: 30px;
      padding: 20px;
      overflow: auto;
      height: 70vh;
      div.review {
        margin-bottom: 20px;
        div {
          font-size: 15px;
          width: 60px;
          margin-bottom: 5px;
          img {
            width: 50px;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            object-fit: cover;
          }
        }
        p {
          border: 2px solid black;
          background-color: rgba(64, 115, 158, 1);
          color: white;
          padding: 15px;
          line-height: 1.2;
          border-radius: 20px;
          border-bottom-left-radius: 0;
          margin-bottom: 5px;
        }
      }
      .noReviews {
        margin: 0 auto;
        margin-top: 20px;
        position: relative;

        width: 200px;
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
    }
  }
`;
const ActorWrapper = styled.div`
  h1 {
    font-size: 25px;
    font-weight: 600;
    text-align: center;
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .actorWrapper {
    padding: 10px;
    height: 70vh;
    display: grid;
    grid-template-columns: ${(props) =>
      props.width > 800 ? "repeat(2, 1fr)" : ""};
    /* grid-template-rows:${(props) => (props.width > 550 ? "" : "")} */
    gap: 5px;
    padding: 20px;
    //justify-items: center;
    overflow: auto;
    .actorProfile {
      display: flex;
      flex-direction: ${(props) => (props.width > 500 ? "" : "column")};
      img {
        height: 100px;
        width: 80px;
        margin-bottom: 5px;
      }
      div.actorInfo {
        margin-left: 10px;
        height: 130px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        button {
          margin-top: 20px;
          width: 40px;
          height: 25px;
          border: none;
          outline: none;
          color: white;
          padding: 0;
          background-color: rgba(64, 115, 158, 1);
          border-radius: 5px;
          &:active {
            transform: scale(0.98, 0.98);
          }
        }
      }
    }
  }
  .noActors {
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

const ActorPage = ({ data, width }) => {
  return (
    <ItemActor
      src={`https://image.tmdb.org/t/p/w300${data["results"].poster_path}`}
    >
      <ActorWrapper width={width}>
        <h1>Actors</h1>
        {data["actors"].cast.length ? (
          <div className="actorWrapper">
            {data["actors"].cast.map((item, index) => (
              <div className="actorProfile" key={index}>
                <img
                  src={
                    item.profile_path
                      ? `https://image.tmdb.org/t/p/w300${item.profile_path}`
                      : "https://usecloud.s3-ap-northeast-1.amazonaws.com/%EC%96%B4%EB%AA%BD%EC%96%B4%EC%8A%A4.PNG"
                  }
                  alt=""
                ></img>
                <div className="actorInfo">
                  <div>{item.name}</div>
                  <Link to={`/actor/${item.credit_id}`} key={index}>
                    <button>Detail</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="noActors">
            <img
              src="https://usecloud.s3-ap-northeast-1.amazonaws.com/%EC%96%B4%EB%AA%BD%EC%96%B4%EC%8A%A43.PNG"
              alt=""
            />
            <div>There are no Information</div>
          </div>
        )}
      </ActorWrapper>
      <BackPage className="backPage">
        <h1>Reviews</h1>
        <div className="reviewWrapper">
          {data.reviews.results.length ? (
            data.reviews.results.map((item, index) => (
              <div className="review" key={index}>
                <div>
                  <img
                    src="https://usecloud.s3-ap-northeast-1.amazonaws.com/%EC%96%B4%EB%AA%BD%EC%96%B4%EC%8A%A4.PNG"
                    alt=""
                  ></img>
                  <span>{item.author}</span>
                </div>
                <p>{item.content}</p>
                <span>{item.created_at}</span>
              </div>
            ))
          ) : (
            <div className="noReviews">
              <img
                src="https://usecloud.s3-ap-northeast-1.amazonaws.com/%EC%96%B4%EB%AA%BD%EC%96%B4%EC%8A%A42.PNG"
                alt=""
              />
              <div>There are no Reviews</div>
            </div>
          )}
        </div>
      </BackPage>
    </ItemActor>
  );
};

export default ActorPage;

ActorPage.propTypes = {
  data: PropTypes.object,
  width: PropTypes.number,
};
