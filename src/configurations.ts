export interface ILoggerConfig {
  service: string;
  level: string;
  transportsToConsole: boolean;
  transportsToFile: boolean;
}

export interface IRabbitMQConfig {
  consumer: string;
  exchange: string;
  hostname: string;
  port: number;
  username: string;
  password: string;
}

export interface IMongoConfig {
  connectionString: string;
  user: string;
  password: string;
}

export interface ITelegramConfig {
  chanelId: string;
  botToken: string;
  isAllowSendMessage: string;
  prefix: string;
}

export interface IAppConfig {
  name: string;
  version: string;
}

export interface IHttpConfig {
  port: number;
  cors?: { [key: string]: unknown };
  debug?: boolean;
}

export class RabbitMQConfig implements IRabbitMQConfig {
  constructor(
    public consumer: string,
    public exchange: string,
    public hostname: string = 'localhost',
    public port: number = 5672,
    public username: string = 'guest',
    public password: string = 'guest'
  ) {}
}

export class MongoConfig implements IMongoConfig {
  constructor(
    public connectionString = 'mongodb://localhost:27017/myapp',
    public user = '',
    public password = ''
  ) {}
}

export class TelegramConfig implements ITelegramConfig {
  constructor(
    public chanelId: string,
    public botToken: string,
    public isAllowSendMessage: string,
    public prefix: string
  ) {}
}

export class AppConfig implements IAppConfig {
  constructor(public name: string, public version: string) {}
}

export class LoggerConfig implements ILoggerConfig {
  constructor(
    public service: string,
    public level: string,
    public transportsToConsole: boolean,
    public transportsToFile: boolean
  ) {}
}

export class HttpConfig implements IHttpConfig {
  constructor(
    public port: number = 5000,
    public debug?: boolean,
    public cors?: { [key: string]: any }
  ) {}
}
