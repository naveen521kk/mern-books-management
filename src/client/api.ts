export interface BookTitle {
    _id: string;
    title: string;
}

export interface Book {
    _id: string;
    title: string;
    authors: string;
    thumbnail: string;
}

export const getBooks = async () => {
    const res = await fetch("/api/book-titles");
    if (!res.ok) throw new Error(res.statusText);
    const books = await res.json() as BookTitle[];
    return books;
};

export const getAllBooks = async () => {
    const res = await fetch("/api/books");
    if (!res.ok) throw new Error(res.statusText);
    const books = await res.json() as Book[];
    return books;
};

export const getBook = async (id: string) => {
    const res = await fetch(`/api/books/${id}`);
    if (!res.ok) throw new Error(res.statusText);
    const book = await res.json() as Book;
    return book;
};

export const deleteBook = async (id: string) => {
    const res = await fetch(`/api/books/${id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error(res.statusText);
    const deletedBook: Book = await res.json();
    return deletedBook;
};

export const addBook = async (book: Book) => {
    const res = await fetch("/api/books", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
    });
    if (!res.ok) throw new Error(res.statusText);
    const newBook: any = await res.json();
    return newBook;
}

export const searchBooks = async (query: string) => {
    const res = await fetch(`/api/search?q=${query}`);
    if (!res.ok) throw new Error(res.statusText);
    const books = await res.json() as Book[];
    return books;
};
