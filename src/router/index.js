import { connect } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SetUpPage from "../pages/SetUpPage";
import Login from "../components/Login";
import ConferencePage from "../pages/Conference";
import JoinLink from "../pages/JoinLink";

const Router = (props) => {
  const { isLoggedIn, isSetupComplete } = props;
  return (
    <BrowserRouter>
      <Routes>
        {!isLoggedIn && <Route path="/" element={<Login />}></Route>}
        {isLoggedIn && !isSetupComplete && (
          <Route path="/" element={<SetUpPage />}></Route>
        )}
        {isLoggedIn && isSetupComplete && (
          <Route path="/" element={<ConferencePage />}></Route>
        )}
        <Route path="/setup" element={<SetUpPage />}></Route>
        <Route path="/join-with-link/:id" element={<JoinLink />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

const mapStateToProps = (state) => {
  const { login, devices } = state;
  return {
    isLoggedIn: login.isLoggedIn,
    isSetupComplete: devices.isSetupComplete,
  };
};

export default connect(mapStateToProps)(Router);
