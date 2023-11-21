import React from "react";

import Setup from "../components/SetUp";
import { connect } from "react-redux";
import "../assets/css/setup.css";
const SetUpPage = (props) => {
  const { orgName } = props;
  return (
    <div>
      <h1 className="ps-4 pt-4 text-white">{orgName}</h1>
      <Setup />
    </div>
  );
};
const mapStateToProps = (state) => {
  const { orgName } = state.common;
  return { orgName };
};
export default connect(mapStateToProps)(SetUpPage);
