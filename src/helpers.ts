/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ErrorCode, AppError, ErrorMessage } from './errors';
import { Response } from './definitions';

export function sendErrorResponse(e: any, res: Response): void {
  const error = createErrorResponse(e);
  res.status(error.code || 500);

  delete error.code;
  res.json(error);
}

export function sendSuccessReponse(data: any, res: Response): void {
  res.json(data);
}

export function createErrorResponse(error: AppError | any): Partial<AppError> {
  const err: Partial<AppError> = {
    code: ErrorCode.ServerError,
    message: ErrorMessage.ServerError
  };

  if (!error) return err;

  const { message, code, details } = error;
  if (message) err.message = message;
  if (code) err.code = code;
  if (!details) return err;

  err.details = {};
  if (details.platform) err.details.platform = details.platform;
  if (details.message) err.details.message = details.message;
  if (details.code) err.details.code = details.code;
  if (details.fields) err.details.fields = details.fields;
  return err;
}
