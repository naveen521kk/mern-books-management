import { getAllBooks, addBook } from "../api";
import type { Book } from "../api";
import { useLoaderData, Link } from "react-router-dom";
import * as styles from "./index.module.scss";
import { DeleteBook } from "./books";

export default function Index() {
  const { books } = useLoaderData() as { books: Book[] };
  return (
    <div>
      <h1>Books</h1>
      <div className="row row-cols-1 row-cols-md-1 row-cols-lg-2 row-cols-xl-3 g-4">
        {books.map((book) => (
          <div key={book._id} className="col">
            <div
              className="card text-center"
              style={{ width: "18rem", height: "100%" }}
            >
              <img
                src={book.thumbnail}
                className={"card-img-top " + styles.thumbnail}
                alt={book.title}
              />
              <div className="card-body">
                <h5 className="card-title">
                  {book.title} - {book.authors}
                </h5>
                <div className={styles.bottomButtons}>
                  <Link
                    to={`/books/${book._id}`}
                    className="card-link btn btn-success"
                  >
                    Visit
                  </Link>
                  <DeleteBook id={book._id} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function loader() {
  const books = await getAllBooks();
  return { books };
}
