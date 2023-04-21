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
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

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
        errorElement: <div>Oops! There was an error.</div>,
      },
      {
        path: "new",
        element: <AddBooks />,
        action: addAction,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <SignedIn>
        <RouterProvider router={router} />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  </React.StrictMode>
);
