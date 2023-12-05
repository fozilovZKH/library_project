import { DataSource } from "../../lib/dataSource.js";
import path from "path";
import { fileURLToPath } from "url";
import { ResData } from "../../lib/resData.js";
import {
  LoginAlreadyExistException,
  UserNotFoundException,
  UserTypeof,
} from "./exception/user.exception.js";
import { generationId } from "../../lib/generationId.js";
import { User } from "../../lib/userClass.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class UserService {
  userGetAll() {
    const userDir = path.join(__dirname, "../../../database", "users.json");
    const userData = new DataSource(userDir);
    const users = userData.read();

    const resData = new ResData("all users", users);

    return resData;
  }

  createUser(body) {
    const userDir = path.join(__dirname, "../../../database", "users.json");
    const userData = new DataSource(userDir);
    const users = userData.read();

    const foundUserByLogin = users.find((user) => user.login === body.login);

    if (foundUserByLogin) {
      throw new LoginAlreadyExistException("This login already exist");
    }

    const generatedId = generationId(users);

    const newUser = new User(generatedId, body.fullName, body.login, body.age);

    if (typeof body.fullName !== "string" || typeof body.login !== "string") {
      throw new UserTypeof("fullName and login must be string");
    }
    if (typeof body.age !== "number" || !Number.isInteger(body.age)) {
      throw new UserTypeof("age must be number");
    }

    users.push(newUser);

    userData.write(users);

    const resData = new ResData("user created", newUser);

    return resData;
  }

  userFindById(id) {
    const userDir = path.join(__dirname, "../../../database", "users.json");
    const userData = new DataSource(userDir);
    const users = userData.read();

    const foundUserById = users.find((user) => user.id === id);

    if (!foundUserById) {
      throw new UserNotFoundException(`This ${id} user not found`);
    }

    const resData = new ResData("found user", foundUserById);

    return resData;
  }

  updateUser(body, id) {
    const userDir = path.join(__dirname, "../../../database/users.json");
    const userData = new DataSource(userDir);

    const users = userData.read();

    const foundUserIndex = users.findIndex((user) => user.id === id);

    if (foundUserIndex === -1) {
      throw new UserNotFoundException(`This ${id} user not found`);
    }
    const [foundUser] = users.splice(foundUserIndex, 1);

    const foundUserByLogin = users.find((user) => user.login === body.login);

    if (foundUserByLogin) {
      throw new LoginAlreadyExistException("This login already exist");
    }

    foundUser.full_name = body.fullName;
    foundUser.login = body.login;
    foundUser.age = body.age;

    if (typeof foundUser.full_name !== "string" || typeof foundUser.login !== "string") {
      throw new UserTypeof("fullName and login must be string");
    }
    if (typeof foundUser.age !== "number" || !Number.isInteger(foundUser.age)) {
      throw new UserTypeof("age must be number");
    }

    users.push(foundUser);
    userData.write(users);
    const resData = new ResData("user updated", foundUser);

    return resData;
  }

  deleteUser(id) {
    const userDir = path.join(__dirname, "../../../database", "users.json");
    const userData = new DataSource(userDir);
    const users = userData.read();

    const foundUserIndex = users.findIndex((user) => user.id === id);
    if (foundUserIndex === -1) {
      throw new UserNotFoundException(`This ${id} user not found`);
    }

    const [deletedUser] = users.splice(foundUserIndex, 1);
    userData.write(users);
    const resData = new ResData("User deleted successfully!", deletedUser);
    return resData;
  }
}
