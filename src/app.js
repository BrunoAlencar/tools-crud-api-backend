import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import routes from './routes';

import swaggerUI from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';

import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
