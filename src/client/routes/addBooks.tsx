import { Form, redirect } from "react-router-dom";
import { addBook } from "../api";

export default function AddBooks() {
  return (
    <Form method="post" id="book-form">
      <div className="mb-3">
        <label className="form-label">Book Title</label>
        <input
          type="text"
          name="title"
          className="form-control"
          aria-describedby="bookTitleHelp"
          required
        />
        <div id="bookTitleHelp" className="form-text">
          Enter the title of the book.
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Book Authors</label>
        <input
          type="text"
          name="authors"
          className="form-control"
          aria-describedby="bookAuthorHelp"
          required
        />
        <div id="bookAuthorHelp" className="form-text">
          Enter the authors of the book. Separate by <code>;</code> for multiple
          authors.
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Thumbnail</label>
        <input
          type="url"
          name="thumbnail"
          className="form-control"
          aria-describedby="bookThumbnailHelp"
          required
        />
        <div id="bookThumbnailHelp" className="form-text">
          Enter the thumbnail URL of the book.
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </Form>
  );
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const authors = formData.get("authors") as string;
  const thumbnail = formData.get("thumbnail") as string;

  const book = await addBook({ _id: '', title, authors, thumbnail }) as any;
  return redirect(`/books/${book.insertedId}`);
}
