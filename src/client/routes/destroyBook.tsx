import { deleteBook } from "../api";
import { redirect } from "react-router-dom";

export async function action({ params }: { params: any }) {
  await deleteBook(params.bookId);
  return redirect("/");
}
