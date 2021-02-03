import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { actorApi } from "../api";
import { Link } from "react-router-dom";
import SearchPage from "../component/SearchPage";

const Container = styled.div`
  margin-top: 50px;
  height: 80%;
  background-color: #353b48;
  padding: 10px;
  display: flex;
  justify-content: space-around;
`;
const Profile = styled.div`
  display: ${(props) => (props.size > 600 ? "flex" : "block")};
  padding: 0 10px;
  padding-top: 30px;
  img {
    max-width: 300px;
    max-height: 500px;
    object-fit: cover;
    box-shadow: 10px 10px 10px black;
  }
  .actorInfo {
    margin-left: 10px;
    height: 90vh;
    color: white;
    width: 100%;
    padding: 20px;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr 5fr;
    span,
    h1 {
      font-size: 20px;
      font-weight: 600;
      margin-right: 20px;
      color: #e84118;
    }
    h1 {
      margin-bottom: 20px;
    }
    img {
      max-width: 100px;
      max-height: 130px;
      object-fit: contain;
      margin-right: 50px;
      &:hover {
        transform: translateY(-10%);
      }
      transition: transform 0.5s linear;
    }
  }
`;
const Actor = () => {
  const [data, setData] = useState(null);
  const [size, setSize] = useState(window.innerWidth);

  const getData = async () => {
    const id = window.location.href.split("actor/")[1];
    const actor = await actorApi(id);
    setData(actor.data);
  };
  useEffect(() => {
    getData();
    window.addEventListener("resize", () => setSize(window.innerWidth));
    return () =>
      window.removeEventListener("resize", () => setSize(window.innerWidth));
  }, []);

  return data ? (
    <>
      <Container>
        <Profile size={size}>
          <img
            src={`https://image.tmdb.org/t/p/w300/${data.person.profile_path}`}
          />
          <div className="actorInfo">
            <section>
              <span>Name:</span> {data.person.name}
            </section>
            <section>
              <span>Job:</span>
              {data.job}
            </section>
            <section>
              <span>Popularity:</span>
              {data.person.popularity}
            </section>

            <section className="actorMovie">
              <h1>Known for</h1>
              {data.person.known_for.length
                ? data.person.known_for.map((item) => (
                    <Link to={`/${item.id}/${item.media_type}`}>
                      <img
                        src={`https://image.tmdb.org/t/p/w300/${item.poster_path}`}
                      />
                    </Link>
                  ))
                : ""}
            </section>
          </div>
        </Profile>
        <SearchPage></SearchPage>
      </Container>
    </>
  ) : (
    "Loading.."
  );
};

export default Actor;
