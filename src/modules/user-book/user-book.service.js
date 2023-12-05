import { DataSource } from "../../lib/dataSource.js";
import path from "path";
import { fileURLToPath } from "url";
import { ResData } from "../../lib/resData.js";

import { generationId } from "../../lib/generationId.js";
import { UserBook } from "../../lib/userBookClass.js";
import { UserHasBookException } from "./exception/user-book.exception.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class UserBookService {
  #userService;
  constructor(userService) {
    this.#userService = userService;
  }

  createUserBook(body,userId,bookId) {
    this.#userService.userFindById(body.userId);
        
    const userBookDir = path.join(
      __dirname,
      "../../../database",
      "user_books.json"
    );
    const userDir = path.join(__dirname, "../../../database", "users.json");
    const userData = new DataSource(userDir);
    const bookDir = path.join(__dirname, "../../../database", "books.json");
    const bookData = new DataSource(bookDir);
    const userBookData = new DataSource(userBookDir);
    const userBooks = userBookData.read();

    const books = bookData.read();
    const users = userData.read();
    const foundUser = users.find((user) => user.id === userId);
    const foundBook = books.find((book) => book.id === bookId);
    if (!foundUser) {
      const ResData = new ResData("User not found");
      return ResData;
    }
    if (!foundBook) {
      const ResData = new ResData("Book not found");
      return ResData;
    }
    if (foundBook.count === 0) {
      const ResData = new ResData("There is no book");
      return ResData;
    }
    const foundUserBook = userBooks.find(
      (userbook) => userbook.user_id === userId && userbook.book_id === bookId
    );
    if (foundUserBook) {
      const ResData = new ResData("This user has the book");
      return ResData;
    }
    books.push(foundBook);
    bookData.write(books);

    const statisticsDir = path.join(__dirname, "../../../database", "statistics.json");
    const statisticsData = new DataSource(statisticsDir);
  
    const statistics = statisticsData.read();
    const newStatisticsId = generationId(statistics);
    const todayDate = new Date();
    const newStatistics = new statistics(
      newStatisticsId,
      userId,
      bookId,
      "take",
      null,
      todayDate
    );
  
    statistics.push(newStatistics);
    statisticsData.write(statistics);

    const newUserBookId = generationId(userBooks);

    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setDate(currentDate.getDate() + Number(foundBook.duration));
  
    const newUserBook = new UserBook(
      newUserBookId,
      userId,
      bookId,
      currentDate,
      futureDate
    );
    userBooks.push(newUserBook);
    userBookData.write(userBooks);

    const resData = new ResData("created user book", newUserBook);

    return resData;
  }

  #getUserBookByUserIdAndBookId(userId, bookId) {
    const userBookDir = path.join(
      __dirname,
      "../../../database",
      "user_books.json"
    );

    const userBookData = new DataSource(userBookDir);
    const userBooks = userBookData.read();

    const foundUserBookByUserIdAndBookId = userBooks.find(
      (userBook) => userBook.user_id === userId && userBook.book_id === bookId
    );

    return foundUserBookByUserIdAndBookId;
  }
  deleteUserBook(id,res){
    const UserBookPath = path.join(
      __dirname,
      "../../../../database",
      "user_books.json"
    );
    const userbookData = new DataSource(UserBookPath);
    const userBooks = userbookData.read();
    const foundBookUser = userBooks.findIndex(
      (userbook) => userbook.id === Number(id)
    );
    if (foundBookUser === -1) {
      const ResData = new ResData("Userbook not found");
      return ResData;
    }
    const [deleteUserBook] = userBooks.splice(foundBookUser, 1);
    const userId = deleteUserBook.user_id;
    const bookId = deleteUserBook.book_id;
    userbookData.write(userBooks);
    const ResData = new ResData(
      "Userbook deleted successfully",
      deleteUserBook
    );
    res.status(200).json(ResData);

    const BookPath = path.join(__dirname, "../../../../database", "books.json");
    const bookData = new DataSource(BookPath);
    const books = bookData.read();
    const foundBook = books.find((book) => book.id === bookId);
    if (!foundBook) {
      const ResData = new ResData("Book not found");
      return ResData;
    }

    const filterbooks = books.filter((book) => book.id !== foundBook.id);
    foundBook.count = foundBook.count + 1;
    filterbooks.push(foundBook);
    bookData.write(filterbooks);

    const StatisticsPath = path.join(__dirname, "../../../../database", "statistics.json");
    const statisticData = new DataSource(StatisticsPath);
    const statistics = statisticData.read();
    const generatedId = generationId(statistics);
    const createdAt = new Date();
    const newStatistic = new statistics(
      generatedId + 1,
      userId,
      bookId,
      "give",
      "good",
      createdAt.toDateString()
    );
    statistics.push(newStatistic);
    statisticData.write(statistics);
  }
}
