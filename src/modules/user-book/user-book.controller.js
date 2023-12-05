import { ResData } from "../../lib/resData.js";
import { UserIdBookIdRequiresException } from "./exception/user-book.exception.js";

export class UserBookController {
  #userBookService;
  constructor(userBookService) {
    this.#userBookService = userBookService;
  }

  createUserBook(req, res) {
    try {
      const { userId, bookId } = req.body;
      const idu = userId;
      const idb = bookId;

      if (!userId || !bookId) {
        throw new UserIdBookIdRequiresException();
      }

      const response = this.#userBookService.createUserBook(idu,idb);

      res.status(201).json(response);
    } catch (error) {
      const resData = new ResData(error.message, null, error);

      res.status(error.statusCode ?? 500).json(resData);
    }
  }
  deleteUserBook(res,req){
    try {
      const Id = req.params?.id;

      const response = this.#userBookService.deleteUserBook(Id, res);
      res.status(200).json(response)
    } catch (error) {
      const resData = new ResData(error.message, null, error);

      res.status(error.statusCode ?? 500).json(resData);
    }
  }
}
