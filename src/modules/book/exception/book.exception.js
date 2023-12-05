export class BookNameAlreadyExistException extends Error {
  constructor(message) {
    super(message);

    this.statusCode = 400;
  }
}
export class BookNotFoundException extends Error {
  constructor(message) {
    super(message);

    this.statusCode = 404;
  }
}

export class BookTypeof extends Error {
  constructor(message) {
    super(message);

    this.statusCode = 400;
  }
}
