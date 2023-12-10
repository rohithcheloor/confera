import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  setLoading,
  setMobileDevice,
  setOrgLogo,
  setOrgName,
  unsetLoading,
} from "../redux/action/commonActions";
import "../assets/css/loading.css";

const InitialConfig = (props) => {
  const {
    loading,
    setLoading,
    unsetLoading,
    orgName,
    setOrgName,
    setMobileDevice,
  } = props;
  useEffect(() => {
    //   /Mobi|Android|iPhone|iPad|Windows Phone|Mobile|Silk|GT-(I|N7|N8|N7P)|SC-02C|SC-03D|SC-05D|SH|SCH|SGH|SPH|SGH-(I|N7|T|T779)|SM-(G|N9|T|N9|P|T|N900|N9005)|SPH-L|SGH-I|LG-(E|MS|P|R|US|AS|V|VS|LS|SU|C|L|K)|DROID|Razr|XOOM|Macintosh/i.test(
    //     navigator.userAgent
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (isMobileDevice) {
      setMobileDevice();
    }
    setLoading();
    let myOrgName = process.env.REACT_APP_COMPANY_NAME;
    if (
      myOrgName &&
      String(myOrgName).trim() !== "" &&
      String(myOrgName).trim().toLowerCase() !== "confera"
    ) {
      setOrgName(`Confera for ${myOrgName}`);
      document.title = orgName;
    } else {
      setOrgName(`Confera`);
      document.title = orgName + " - P2P Video Conferencing";
    }
    unsetLoading();
  }, [orgName]);
  useEffect(() => {
    const companyLogo = process.env.REACT_APP_COMPANY_LOGO;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.getElementsByTagName("head")[0].appendChild(link);
    }
    if (companyLogo && String(companyLogo).trim() !== "") {
      link.href = companyLogo;
    }
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
    setMobileDevice: () => dispatch(setMobileDevice()),
    setLoading: () => dispatch(setLoading()),
    unsetLoading: () => dispatch(unsetLoading()),
    setOrgName: (orgName) => dispatch(setOrgName(orgName)),
    setOrgLogo: (orgLogoUrl) => dispatch(setOrgLogo(orgLogoUrl)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(InitialConfig);
