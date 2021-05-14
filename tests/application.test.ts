import { describe, it } from 'mocha';
import { expect } from 'chai';
import request from 'supertest';

import {
  MainApplication,
  Controller,
  Request,
  Response,
  NextFunction,
  sendSuccessReponse
} from '../src';

// Prepare
interface IUserService {
  getUser(): string;
  createUser(): string;
}

class UserController extends Controller {
  constructor(private userService: IUserService) {
    super();
    this.setupRouter();
  }

  setupRouter() {
    this.router.get('/user', this.wrapTryCatch(this.getUser));
    this.router.post('/user', this.wrapTryCatch(this.create));
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    const result = this.userService.getUser();

    sendSuccessReponse(result, res);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    throw new Error();
  }
}

class App extends MainApplication {
  constructor(userService: IUserService) {
    super(console);
    this.setupControllers(new UserController(userService));
  }
}

class UserService implements IUserService {
  getUser() {
    return 'GET USER';
  }

  createUser() {
    return 'CREATE USER';
  }
}

const userSerivce = new UserService();
const app = new App(userSerivce);

// test
describe('GET /user', () => {
  it('should be return "GET USER"', (done) => {
    request(app.server)
      .get('/user')
      .then((res) => {
        expect(res.statusCode).to.equals(200);
        expect(res.body).to.equals('GET USER');
        done();
      })
      .catch((err) => done(err));
  });
});

describe('POST /user', () => {
  it('should be return code 500', (done) => {
    request(app.server)
      .post('/user')
      .then((res) => {
        expect(res.statusCode).to.equals(500);
        done();
      })
      .catch((err) => done(err));
  });
});
