import { Router, Handler } from 'express';

type AsyncFuntion = (...args: any[]) => Promise<unknown>;

export interface IController {
  router: Router;
}

export abstract class Controller implements IController {
  router: Router;

  constructor() {
    this.router = Router();
  }

  setupRouter(): void {
    // Implement
  }

  protected wrapTryCatch(handle: AsyncFuntion): Handler {
    handle = handle.bind(this);
    return (...args) => handle(...args).catch(args[2]);
  }
}
