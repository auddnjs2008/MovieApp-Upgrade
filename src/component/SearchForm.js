import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { searchActionCreator } from "../store/modules/Search";

const Container = styled.form`
  //position: absolute;
  //right: 5px;
  //top: 10px;

  width: ${(props) => (props.width < 450 ? "80px" : "")};
  input {
    outline: none;
    border: none;
    padding: 5px;
    width: inherit;
    background-color: #2c3e50;
    color: white;
    &::placeholder {
      color: white;
    }
  }
`;

const SearchForm = ({ search, doSearch, width }) => {
  const onSubmit = (e) => {
    e.preventDefault();
    // 검색 기능

    //검색후 기능  search state는 ""로 셋팅해준다.
    // notSearch();
  };

  const onChange = (e) => {
    const text = e.target.value;
    // 변한 직전에  검색을 해주어야 한다.
    doSearch(text);
  };

  return (
    <Container onSubmit={onSubmit} width={width}>
      <input
        type="text"
        placeholder="Search"
        value={search.text}
        onChange={onChange}
        width={width}
        className="searchInput"
      ></input>
    </Container>
  );
};

const mapStateToProps = (state, ownProps) => {
  return { search: state.Search };
};
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    doSearch: (text) => dispatch(searchActionCreator.search(text)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchForm);

SearchForm.propTypes = {
  search: PropTypes.string,
  doSearch: PropTypes.func,
  width: PropTypes.number,
};
