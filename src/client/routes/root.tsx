import {
  Outlet,
  NavLink,
  useLoaderData,
  useNavigation,
  Link,
  Form,
} from "react-router-dom";
import { getBooks, searchBooks } from "../api";
import type { BookTitle } from "../api";
import * as styles from "./root.module.scss";
import { useEffect } from "react";
import { useClerk } from "@clerk/clerk-react";

export default function Root() {
  const { books, q } = useLoaderData() as { books: BookTitle[]; q: string };
  const navigation = useNavigation();

  useEffect(() => {
    document && ((document.getElementById("q") as HTMLInputElement).value = q);
  }, [q]);

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  const { signOut } = useClerk();
  return (
    <div className={"container-xxl mt-3 my-md-4 " + styles.rootLayout}>
      <aside id="sidebar" className={styles.sidebar}>
        <Link to="/" className={styles.headerLink}>
          <h1>Books viewer</h1>
        </Link>
        <div className="my-2 mx-4">
          <Form id="search-form" role="search">
            <div className="input-group">
              <span className="input-group-text" id="basic-addon1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="1rem"
                  height="1rem"
                  className={searching ? styles.searchLoading : ""}
                >
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                </svg>
                <div
                  id="search-spinner"
                  aria-hidden
                  hidden={!searching}
                  className={styles.searchSpinner}
                />
              </span>

              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
                className="form-control form-control-sm"
                defaultValue={q}
              />
            </div>
            <div className="sr-only" aria-live="polite"></div>
          </Form>
        </div>

        <div className="d-grid gap-2">
          <Link to="/new" className="btn btn-outline-success btn-sm mx-4">
            New
          </Link>
        </div>
        <div className="d-grid gap-2 mt-2">
          <button
            className="btn btn-outline-danger btn-sm mx-4"
            onClick={() => {
              signOut();
            }}
          >
            Sign out
          </button>
        </div>
        <nav className={styles.navBar}>
          {books.length ? (
            <ul>
              {[...books].map((book) => (
                <li key={book._id}>
                  <NavLink
                    to={`books/${book._id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? styles.active : isPending ? styles.pending : ""
                    }
                  >
                    {book.title ? <>{book.title}</> : <i>No title</i>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No books</i>
            </p>
          )}
        </nav>
      </aside>
      <main
        id="detail"
        className={
          (navigation.state === "loading" ? styles.loading : "") +
          " " +
          styles.main
        }
      >
        <Outlet />
      </main>
    </div>
  );
}

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  if (q) {
    const books = await searchBooks(q);
    return { books, q };
  }
  const books = await getBooks();
  return { books, q: "" };
}
