import { Form, useLoaderData } from "react-router-dom";
import { getBook } from "../api";
import type { Book } from "../api";

export function DeleteBook({ id }: { id: string }) {
  return (
    <Form
      method="post"
      action={`/books/${id}/destroy`}
      onSubmit={(event) => {
        if (!confirm("Please confirm you want to delete this record.")) {
          event.preventDefault();
        }
      }}
    >
      <button type="submit" className="btn btn-danger">
        Delete
      </button>
    </Form>
  );
}

export default function Book() {
  const { book } = useLoaderData() as { book: Book };

  return (
    <div id="books" className="my-4 d-flex align-items-center flex-column text-center">
      <div>
        <img key={book.thumbnail} src={book.thumbnail || undefined} />
      </div>

      <div>
        <h1>{book.title}</h1>
        <p>{book.authors}</p>
      </div>
      <DeleteBook id={book._id} />
    </div>
  );
}

export async function loader({ params }: { params: any }) {
  const book = await getBook(params.bookId);
  return { book };
}
