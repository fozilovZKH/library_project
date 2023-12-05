import { ResData } from "../../lib/resData.js";

export class BookController {
  #bookService;
  constructor(bookService) {
    this.#bookService = bookService;
  }
  getBookById(req, res) {
    try {
      const userId = req.params?.id;

      const response = this.#bookService.bookFindById(Number(userId));

      res.status(200).json(response);
    } catch (error) {
      const resData = new ResData(error.message, null, error);

      res.status(error.statusCode ?? 500).json(resData);
    }
  }

  getAllBooks(_, res) {
    try {
      const response = this.#bookService.bookGetAll();

      res.status(200).json(response);
    } catch (error) {
      const resData = new ResData(error.message, null, error);

      res.status(error.statusCode ?? 500).json(resData);
    }
  }

  createBook(req, res) {
    const { name, count, duration } = req.body;
    if (!name || !count || !duration) {
      const resData = new ResData("name, count, duration must be require!");

      return res.status(400).json(resData);
    }
    const response = this.#bookService.createBook(req.body);

      res.status(201).json(response);
    try {
    } catch (error) {
      const resData = new ResData(error.message, null, error);

      res.status(error.statusCode ?? 500).json(resData);
    }
  }

  updateBook(req, res) {
    try {
      const bookId = req.params?.id;

      const response = this.#bookService.updateBook(req.body,Number(bookId));
      const { name, count, duration } = req.body;
      if (!name || !count || !duration) {
        const resData = new ResData("name, count, duration must be require!");

        return res.status(400).json(resData);
      }

      res.status(200).json(response);
    } catch (error) {
      const resData = new ResData(error.message, null, error);

      res.status(error.statusCode ?? 500).json(resData);
    }
  }

  deleteBook(req, res) {
    try {
      const bookId = req.params?.id;

      const response = this.#bookService.deleteBook(Number(bookId));

      res.status(200).json(response);
    } catch (error) {
      const resData = new ResData(error.message, null, error);

      res.status(error.statusCode ?? 500).json(resData);
    }
  }
}
