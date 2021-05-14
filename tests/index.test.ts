import { describe, it } from 'mocha';
import { expect } from 'chai';
import request from 'supertest';

import packageJSON from '../package.json';

import {
  MainApplication,
  Controller,
  Request,
  Response,
  NextFunction,
  sendSuccessReponse
} from '../src';

class UserController extends Controller {
  constructor() {
    super();
    this.setupRouter();
  }

  setupRouter() {
    this.router.get('/user', this.wrapTryCatch(this.getUser));
    this.router.post('/user', this.wrapTryCatch(this.create));
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    const result = 'GET USER';

    sendSuccessReponse(result, res);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    throw new Error();
  }
}

class App extends MainApplication {
  constructor() {
    super(console, { name: 'My app', version: packageJSON.version, port: 5000 });
    this.setupControllers(new UserController());
  }
}

const app = new App();
app.showInfo();
// Start app
// app.start();

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
