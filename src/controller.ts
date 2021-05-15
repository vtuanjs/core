import { IController, AsyncFuntion, Router, Handler } from './definitions';

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
