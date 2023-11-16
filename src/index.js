import React from "react";
import ReactDOM from "react-dom/client";

import App from "./components/App";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import * as process from 'process';

(window).global = window;
(window).process = process;
(window).Buffer = [];
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
