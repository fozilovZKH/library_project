import { BookController } from "./book.controller.js";
import { BookService } from "./book.service.js";
import { Router } from "express";

const router = Router();

const bookService = new BookService();
const bookController = new BookController(bookService);

router.get("/", (req, res) => {
  bookController.getAllBooks(req, res);
});

router.get("/:id", (req, res) => {
  bookController.getBookById(req, res);
});

router.post("/", (req, res) => {
  bookController.createBook(req, res);
});

router.put("/:id", (req, res) => {
  bookController.updateBook(req, res);
});

router.delete("/:id", (req, res) => {
  bookController.deleteBook(req, res);
});

export default router;
