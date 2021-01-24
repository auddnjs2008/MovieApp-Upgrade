import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { actorApi } from "../api";

const Container = styled.div`
  .actorInfo {
    color: white;
  }
`;
const Profile = styled.div``;
const Actor = () => {
  const [data, setData] = useState(null);

  useEffect(async () => {
    const id = window.location.href.split("actor/")[1];
    const actor = await actorApi(id);
    setData(actor.data);
  }, []);
  console.log(data);
  return data ? (
    <>
      <Container>
        <Profile>
          <img
            src={`https://image.tmdb.org/t/p/w300/${data.person.profile_path}`}
          />
          <div className="actorInfo">
            <h1>{data.person.name}</h1>
            <h3>{data.job}</h3>
            <h3>{data.person.popularity}</h3>
            {data.person.known_for.length
              ? data.person.known_for.map((item) => (
                  <img
                    src={`https://image.tmdb.org/t/p/w300/${item.poster_path}`}
                  />
                ))
              : ""}
          </div>
        </Profile>
      </Container>
    </>
  ) : (
    "Loading.."
  );
};

export default Actor;
