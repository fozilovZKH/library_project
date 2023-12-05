import { Router } from "express";
import { UserBookController } from "./user-book.controller.js";
import { UserBookService } from "./user-book.service.js";
import { UserService } from "../user/user.service.js";

const userService = new UserService();
const userBookService = new UserBookService(userService);
const userBookController = new UserBookController(userBookService);

const router = Router();

router.post("/", (req, res) => {
  userBookController.createUserBook(req, res);
});
router.delete("/:id", (req, res) => {
  userBookController.deleteUserBook(req, res);
});

export default router;
