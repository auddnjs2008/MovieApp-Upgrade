import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { authService } from "../fbase";
import { connect } from "react-redux";
import { userActionCreator } from "../store/modules/User";

const MyPage = ({ logOut }) => {
  const logoutClick = async () => {
    await authService.signOut();
  };

  return (
    <>
      <div>my page</div>
      <button onClick={logoutClick}>Log Out</button>
    </>
  );
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return { logOut: () => dispatch(userActionCreator.logout()) };
};
export default connect(null, mapDispatchToProps)(MyPage);
