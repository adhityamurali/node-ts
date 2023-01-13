import './util/module-alias';
import { Server } from '@overnightjs/core';
import { Application } from 'express';
import bodyParser from 'body-parser';
import * as http from 'http';
import expressPino from 'express-pino-logger';
import cors from 'cors';

import * as database from '@src/database';

import { CartController } from './controllers/cart';
import logger from './logger';

import { apiErrorValidator } from './middlewares/api-error-validator';

import { CartMongoDBRepository } from './repositories/cartMongoDBRepository';
import { ProductController } from './controllers/product';
import { ProductMongoDBRepository } from './repositories/productMongoDBRepository';
import { WarehouseController } from './controllers/warehouse';
import { WarehouseMongoDBRepository } from './repositories/WarehouseMongoDBRepository';

export class SetupServer extends Server {
  private server?: http.Server;
  /*
   * same as this.port = port, declaring as private here will
   * add the port variable to the SetupServer instance
   */
  constructor(private port = 3000) {
    super();
  }

  /*
   * We use a different method to init instead of using the constructor
   * this way we allow the server to be used in tests and normal initialization
   */
  public async init(): Promise<void> {
    this.setupExpress();
    //await this.docsSetup();
    this.setupControllers();
    await this.databaseSetup();
    //must be the last
    this.setupErrorHandlers();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(
      expressPino({
        logger,
      })
    );
    this.app.use(
      cors({
        origin: '*',
      })
    );
  }


  private setupControllers(): void {

    const cartController = new CartController(
      new CartMongoDBRepository(), new ProductMongoDBRepository(), new WarehouseMongoDBRepository()

    );
    const productController = new ProductController(
      new ProductMongoDBRepository()
    );

    const warehouseController = new WarehouseController(new WarehouseMongoDBRepository());

    
    this.addControllers([
      productController,
      cartController,
      warehouseController
    ]);
  }

  private setupErrorHandlers(): void {
    this.app.use(apiErrorValidator);
  }

  public getApp(): Application {
    return this.app;
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
    if (this.server) {
      await new Promise((resolve, reject) => {
        this.server?.close((err) => {
          if (err) {
            return reject(err);
          }
          resolve(true);
        });
      });
    }
  }

  public start(): void {
    this.server = this.app.listen(this.port, () => {
      logger.info('Server listening on port: ' + this.port);
    });
  }
}
