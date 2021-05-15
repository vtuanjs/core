import { Router } from 'express';

export { Request, Response, NextFunction, Router, Handler, Application } from 'express';

export interface ILogger {
  info(message?: string, details?: any): void;
  error(message?: string, details?: any): void;
  warn(message?: string, details?: any): void;
  debug(message?: string, details?: any): void;
}

export type AsyncFuntion = (...args: any[]) => Promise<unknown>;

export interface IController {
  router: Router;
}

export interface ILogger {
  info(message?: string, details?: any): void;
  error(message?: string, details?: any): void;
  warn(message?: string, details?: any): void;
  debug(message?: string, details?: any): void;
}

export type Config = {
  name?: string;
  version?: string;
  port?: number;
  cors?: { [key: string]: unknown };
  debug?: boolean;
};
