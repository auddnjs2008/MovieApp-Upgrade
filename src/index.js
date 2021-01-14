import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./component/App";
import store from "./store/index";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
