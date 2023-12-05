import { DataSource } from "../../lib/dataSource.js";
import path from "path";
import { fileURLToPath } from "url";
import { ResData } from "../../lib/resData.js";
import {
  BookNameAlreadyExistException,
  BookNotFoundException,
  BookTypeof,
} from "./exception/book.exception.js";
import { generationId } from "../../lib/generationId.js";
import { Book } from "../../lib/bookClass.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class BookService {
  bookGetAll() {
    const bookDir = path.join(__dirname, "../../../database", "books.json");
    const bookData = new DataSource(bookDir);
    const books = bookData.read();

    const resData = new ResData("all users", books);

    return resData;
  }

  bookFindById(id) {
    const bookDir = path.join(__dirname, "../../../database", "books.json");
    const bookData = new DataSource(bookDir);
    const books = bookData.read();

    const foundBookById = books.find((book) => book.id === id);

    if (!foundBookById) {
      throw new BookNotFoundException(`This ${id} book not found`);
    }

    const resData = new ResData("found book", foundBookById);

    return resData;
  }

  createBook(body) {
    const bookDir = path.join(__dirname, "../../../database", "books.json");
    const bookData = new DataSource(bookDir);
    const books = bookData.read();

    const foundBookByName = books.find((book) => book.name === body.name);
    if (foundBookByName) {
      throw new BookNameAlreadyExistException("This name already exist");
    }
    
    const generatedId = generationId(books);
    const newBook = new Book(generatedId, body.name, body.count, body.duration);
    
    if (typeof body.name !== "string") {
      throw new BookTypeof("name must be string");
    }
    if (
      typeof body.count !== "number" ||
      typeof body.duration !== "number" ||
      !Number.isInteger(body.count) ||
      !Number.isInteger(body.duration)
    ) {
      throw new BookTypeof("count and duration must be number");
    }

    books.push(newBook);
    bookData.write(books);

    const resData = new ResData("Book created successfully!", newBook);

    return resData;
  }

  updateBook(body, id) {
    const bookDir = path.join(__dirname, "../../../database", "books.json");
    const bookData = new DataSource(bookDir);
    const books = bookData.read();

    const foundBookIndex = books.findIndex((book) => book.id === id);
    const foundBookByName = books.find((book) => book.name === body.name);

    if (foundBookIndex === -1) {
      throw new BookNotFoundException(`This ${id} book not found`);
    }

    const [foundBook] = books.splice(foundBookIndex, 1);

    if (foundBookByName && foundBook.name !== body.name) {
      throw new BookNameAlreadyExistException("This name already exist");
    }

    foundBook.name = body.name;
    foundBook.count = body.count;
    foundBook.duration = body.duration;

    if (typeof foundBook.name !== "string") {
      throw new BookTypeof("name must be string");
    }
    if (
      typeof foundBook.count !== "number" ||
      typeof foundBook.duration !== "number" ||
      !Number.isInteger(foundBook.count) ||
      !Number.isInteger(foundBook.duration)
    ) {
      throw new BookTypeof("count and duration must be number");
    }

    books.push(foundBook);
    bookData.write(books);

    const resData = new ResData("Book successfully updated!", foundBook);
    return resData;
  }

  deleteBook(id) {
    const bookDir = path.join(__dirname, "../../../database", "books.json");
    const bookData = new DataSource(bookDir);
    const books = bookData.read();

    const foundBookIndex = books.findIndex((book) => book.id === id);
    if (foundBookIndex === -1) {
      throw new BookNotFoundException(`This ${id} book not found`);
    }

    const [deletedBook] = books.splice(foundBookIndex, 1);
    bookData.write(books);

    const resData = new ResData("Book deleted successfully!", deletedBook);
    return resData;
  }
}
