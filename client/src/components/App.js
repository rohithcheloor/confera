import React from "react";
import Router from "../router";
import InitialConfig from "./InitialConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div>
      <InitialConfig />
      <Router />
      <ToastContainer />
    </div>
  );
}

export default App;
