import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  setLoading,
  setOrgLogo,
  setOrgName,
  unsetLoading,
} from "../redux/action/commonActions";
import "../assets/css/loading.css";

const InitialConfig = (props) => {
  const { loading, setLoading, unsetLoading, orgName, setOrgName } = props;
  useEffect(() => {
    setLoading();
    let myOrgName = process.env.REACT_APP_COMPANY_NAME;
    if (
      myOrgName &&
      String(myOrgName).trim() !== "" &&
      String(myOrgName).trim().toLowerCase() !== "confera"
    ) {
      setOrgName(`Confera for ${myOrgName}`);
    } else {
      setOrgName(`Confera`);
    }
    document.title = orgName;
    unsetLoading();
  }, []);
  return (
    <React.Fragment>
      {loading === true && (
        <div className="loading-screen">
          <div className="lds-grid">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
const mapStateToProps = (state) => {
  const { loading, orgName } = state.common;
  return {
    loading,
    orgName,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLoading: () => dispatch(setLoading()),
    unsetLoading: () => dispatch(unsetLoading()),
    setOrgName: (orgName) => dispatch(setOrgName(orgName)),
    setOrgLogo: (orgLogoUrl) => dispatch(setOrgLogo(orgLogoUrl)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(InitialConfig);
