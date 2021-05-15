import http, { Server } from 'http';
import express from 'express';
import compression from 'compression';
import cors from 'cors';
import {
  IController,
  ILogger,
  Config,
  Application,
  Request,
  Response,
  NextFunction
} from './defination';
import { sendErrorResponse, createErrorResponse } from './helpers';

export abstract class MainApplication {
  server: Server;
  app: Application;
  config: Config;

  constructor(public logger: ILogger, config?: Config) {
    this.config = {
      port: 5000,
      debug: false,
      name: 'Express App',
      version: '1.0.0',
      ...config
    };

    this.app = express();
    this.app.use(cors(this.config.cors));
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
    if (this.config.debug) {
      this.logger.warn(`API Error: ${req.url}`, createErrorResponse(err));
    }

    sendErrorResponse(err, res);
  }

  showInfo(): void {
    this.logger.info(`Application: ${this.config.name}`);
    this.logger.info(`Version: ${this.config.version} \n`);
  }

  start(): void {
    this.logger.info(`Starting server...`);
    this.server.listen(this.config.port, () => {
      this.logger.info(`Server running at Port: ${this.config.port}`);
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
