import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Home from "./components/Home";
import RespondentInfo from "./components/RespondentInfo";
import Survey from "./components/Survey";
import Result from "./components/Result";
import LookUp from "./components/LookUp";
import Info from "./components/Info";
import Login from "./components/Login";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/create",
    element: <App />,
    children: [
      {
        path: "/create",
        element: <RespondentInfo />,
      },
    ],
  },
  {
    path: "/survey/:id",
    element: <App />,
    children: [
      {
        path: "/survey/:id",
        element: <Survey />,
      },
    ],
  },
  {
    path: "/result",
    element: <App />,
    children: [
      {
        path: "/result",
        element: <LookUp />,
      },
    ],
  },
  {
    path: "/result/:id",
    element: <App />,
    children: [
      {
        path: "/result/:id",
        element: <Result />,
      },
    ],
  },
  {
    path: "/info",
    element: <App />,
    children: [
      {
        path: "/info",
        element: <Info />,
      },
    ],
  },
  {
    path: "/admin",
    element: <App />,
    children: [
      {
        path: "/admin",
        element: <Login />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
