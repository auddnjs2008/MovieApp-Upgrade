import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { dramaApi } from "../api";
import SearchPage from "../component/SearchPage";
import { storeService } from "../fbase";
import { queryAllByAttribute } from "@testing-library/react";
import { connect } from "react-redux";
import { myListActionCreator } from "../store/modules/MyList";
import PosterSlider from "../component/PosterSlider";
import HeaderPoster from "../component/HeaderPoster";

const Container = styled.div`
  width: 100%;
`;
const ContentWrapper = styled.div`
  div.hoverBox {
    background-color: rgba(20, 20, 20, 1);
    border-radius: 20px;
    width: 100px;
    height: 130px;
    color: white;
    img.videoWrapper {
      width: 50px;
      height: 50px;
    }
    div.videoWrapper {
      position: relative;
      height: 0;
      padding-bottom: 56.25%;
      iframe {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    transform: translate(-25%, -25%);
    @keyframes hoverMove {
      0% {
        transform: scale(1, 1);
      }
      100% {
        transform: scale(3, 2);
      }
    }

    animation: hoverMove 0.2s linear forwards;

    h4 {
      padding: 10px;
      color: white;
      font-size: 3px;
      text-align: center;
      margin: 5px 0px;
      // padding: 10px;
    }
    div {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 10px;
        height: 10px;
        border: none;
        outline: none;
        color: white;
        background-color: rgba(64, 115, 158, 1);
        border-radius: 5px;
        &:active {
          transform: scale(0.98, 0.98);
        }
      }
      a {
        font-size: 10px;
        border: 1px solid rgba(64, 115, 158, 1);
        padding: 3px;
        border-radius: 5px;
        cursor: pointer;
        &:active {
          transform: scale(0.99, 0.99);
        }
      }
    }
  }
`;

const SectionWrapper = styled.section`
  position: relative;
  margin-bottom: 50px;
  padding: 10px;

  h1 {
    color: white;
    font-size: 25px;
    margin-bottom: 20px;
  }
  &:hover {
    div#left,
    div#right {
      opacity: 1;
    }
  }
`;

const Drama = ({ MyList, listPush, bunchPush, uid, errorText }) => {
  const [data, setData] = useState({});
  const [width, setWidth] = useState(window.innerWidth);
  const [isMobile] = useState(
    /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)
  );

  const findData = useCallback(async () => {
    let testArray = [];
    const test = await storeService
      .collection(`mwFlix-${uid}`)
      .get(queryAllByAttribute);

    test.forEach((item) =>
      testArray.push({
        id: parseInt(item.data().id),
        content: item.data().type,
      })
    );

    bunchPush(testArray);
  }, [bunchPush, uid]);

  const getData = async () => {
    const {
      data: { results: popular },
    } = await dramaApi.popular();

    const {
      data: { results: onAir },
    } = await dramaApi.onAir();

    const {
      data: { results: topRated },
    } = await dramaApi.topRated();

    const Random = Math.floor(Math.random() * (onAir.length - 1)) + 1;
    const latestVideo = (await dramaApi.videos(parseInt(onAir[Random].id))).data
      .results;
    const latest = onAir[Random];
    setData({ popular, onAir, topRated, latest, latestVideo });
  };

  useEffect(() => {
    if (!MyList.length) findData(); // 처음 로그인하고  화면들어올때만  셋팅을 해준다.
  }, [findData]);

  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));

    return () =>
      window.removeEventListener("resize", () => setWidth(window.innerWidth));
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return Object.keys(data).length !== 0 ? (
    <Container>
      <HeaderPoster
        video={data["latestVideo"]}
        data={data["latest"]}
        width={width}
        type={"tv"}
      />

      <ContentWrapper className="content">
        <SectionWrapper>
          <h1>Popular Drama</h1>
          <PosterSlider
            data={data["popular"]}
            isMobile={isMobile}
            type="tv"
          ></PosterSlider>
        </SectionWrapper>

        <SectionWrapper>
          <h1>onAir</h1>
          <PosterSlider
            data={data["onAir"]}
            isMobile={isMobile}
            type="tv"
          ></PosterSlider>
        </SectionWrapper>
        <SectionWrapper>
          <h1>Top-Rated</h1>
          <PosterSlider
            data={data["topRated"]}
            isMobile={isMobile}
            type="tv"
          ></PosterSlider>
        </SectionWrapper>
      </ContentWrapper>
      <SearchPage></SearchPage>
    </Container>
  ) : (
    "Loading..."
  );
};

const mapStateToProps = (state, ownProps) => {
  return { MyList: state.MyList, uid: state.User.user.uid };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    bunchPush: (data) => dispatch(myListActionCreator.dataBunchPush(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Drama);

Drama.propTypes = {
  MyList: PropTypes.array,
  bunchPush: PropTypes.func,
  uid: PropTypes.string,
};
