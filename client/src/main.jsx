import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Survey from "./components/Survey";
import RecordList from "./components/RespondentList";
import "./index.css";
import RespondentInfo from "./components/RespondentInfo";
import Result from "./components/Result";
import LookUp from "./components/LookUp";
import Info from "./components/Info";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <RecordList />,
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
    path: "/edit/:id",
    element: <App />,
    children: [
      {
        path: "/edit/:id",
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
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
