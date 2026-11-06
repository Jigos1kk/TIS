export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors?: string[];

  constructor(message: string, statusCode: number = 400, errors?: string[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request", errors?: string[]) {
    super(message, 400, errors);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict") {
    super(message, 409);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not Found") {
    super(message, 404);
  }
}
