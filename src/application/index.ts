import http, { Server } from 'http';
import express, { Application, Request, Response, NextFunction } from 'express';
import compression from 'compression';
import cors from 'cors';
import { IController } from './controller';
import { sendErrorResponse, createErrorResponse } from './helpers';

import { IAppConfig, IHttpConfig } from '../configurations';
import { ILogger } from '../logger';

export default abstract class App {
  server: Server;
  app: Application;

  constructor(
    public appConfig: IAppConfig,
    public httpConfig: IHttpConfig,
    public logger: ILogger
  ) {
    this.app = express();
    this.app.use(cors());
    this.app.use(compression());
    this.handleRequestError = this.handleRequestError.bind(this);
    this.setupControllersWithoutBodyParser();
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json({ limit: '50MB' }));
    this.server = http.createServer(this.app);
  }

  protected setupControllersWithoutBodyParser(...controllers: IController[]): void {
    controllers.forEach((controller) => this.app.use(controller.router));
  }

  protected setupControllers(...controllers: IController[]): void {
    controllers.forEach((controller) => this.app.use(controller.router));

    this.app.use(this.handleNotImplementedError);
    this.app.use(this.handleRequestError);
  }

  protected handleNotImplementedError(_req: Request, res: Response): void {
    res.status(404).json({ message: 'Resources not available' });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  protected handleRequestError(err: any, req: Request, res: Response, _next: NextFunction): void {
    if (this.httpConfig.debug) {
      this.logger.warn(`API Error: ${err?.code} ${req.url}`, createErrorResponse(err));
    }

    sendErrorResponse(err, res);
  }

  showInfo(): void {
    this.logger.info(`Application: ${this.appConfig.name}`);
    this.logger.info(`Version: ${this.appConfig.version} \n`);
  }

  start(): void {
    this.logger.info(`Starting server...`);
    this.server.listen(this.httpConfig.port, () => {
      this.logger.info(`Server running at Port: ${this.httpConfig.port}`);
    });
  }

  close(): void {
    this.logger.info(`Closing server...\n`);

    this.server.close((err) => {
      if (err) {
        this.logger.error(`Closing server failed`, err);
      }
    });
  }
}
