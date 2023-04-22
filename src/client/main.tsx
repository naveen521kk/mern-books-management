import "./index.scss";

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root, { loader as rootLoader } from "./routes/root";
import ErrorPage from "./error-page";
import Book, { loader as bookLoader } from "./routes/books";
import Index, { loader as indexLoader } from "./routes/index";
import { action as destroyAction } from "./routes/destroyBook";
import AddBooks, { action as addAction } from "./routes/addBooks";
import {
  ClerkProvider,
} from "@clerk/clerk-react";

const clerkPubKey =
  import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY ||
  "pk_live_Y2xlcmsuc3lydXNkYXJrLndlYnNpdGUk";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      { index: true, element: <Index />, loader: indexLoader },
      {
        path: "books/:bookId",
        element: <Book />,
        loader: bookLoader,
      },
      {
        path: "books/:bookId/destroy",
        action: destroyAction,
        errorElement: <ErrorPage />,
      },
      {
        path: "new",
        element: <AddBooks />,
        action: addAction,
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);
