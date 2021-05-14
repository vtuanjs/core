export enum ErrorCode {
  ServerError = 500,
  AlreadyExistsError = 422,
  PermissionDeniedError = 403,
  NotFoundError = 404,
  UnauthorizedError = 401,
  ValidationError = 400
}

export enum ErrorMessage {
  ServerError = 'Server Error',
  AlreadyExistsError = 'Already Exists Error',
  PermissionDeniedError = 'Permission Denied Error',
  NotFoundError = 'Not Found Error',
  UnauthorizedError = 'Unauthorized Error',
  ValidationError = 'Validation Error'
}

export interface ErrorDetails {
  platform?: string;
  code?: number;
  message?: string;
  fields?: string[];
}

export class AppError extends Error {
  code: number;
  details?: ErrorDetails;

  constructor(code: number = ErrorCode.ServerError, message: string, details?: ErrorDetails) {
    super(message);
    this.message = message;
    this.code = code;
    if (details) {
      this.details = details;
    }
  }
}

export class ServerError extends AppError {
  constructor(message: string = ErrorMessage.ServerError, details?: ErrorDetails) {
    super(ErrorCode.ServerError, message, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = ErrorMessage.NotFoundError, details?: ErrorDetails) {
    super(ErrorCode.NotFoundError, message, details);
  }
}

export class AlreadyExistsError extends AppError {
  constructor(message: string = ErrorMessage.AlreadyExistsError, details?: ErrorDetails) {
    super(ErrorCode.AlreadyExistsError, message, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = ErrorMessage.UnauthorizedError, details?: ErrorDetails) {
    super(ErrorCode.UnauthorizedError, message, details);
  }
}

export class PermissionDeniedError extends AppError {
  constructor(message: string = ErrorMessage.PermissionDeniedError, details?: ErrorDetails) {
    super(ErrorCode.PermissionDeniedError, message, details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = ErrorMessage.ValidationError, details?: ErrorDetails) {
    super(ErrorCode.ValidationError, message, details);
  }
}
