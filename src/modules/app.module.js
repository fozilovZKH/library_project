import { Router } from "express";
import user from "./user/user.module.js";
import book from "./book/book.module.js";
import userBook from "./user-book/user-book.module.js";

const router = Router();

router.use("/user", user);
router.use("/book", book);
router.use("/user-book", userBook);

export default router;
