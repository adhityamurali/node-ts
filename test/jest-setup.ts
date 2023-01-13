import { SetupServer } from '@source/server';
import supertest from 'supertest';
import path from 'path';
import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
  Wait,
} from 'testcontainers';

const composeFilePath = path.resolve(__dirname, '..');
const composeFile = 'docker-compose.yml';
let environment: StartedDockerComposeEnvironment;

let server: SetupServer;

jest.setTimeout(20000);

beforeAll(async () => {
  console.log('jest')
  environment = await new DockerComposeEnvironment(composeFilePath, composeFile)
    .withWaitStrategy('mongodb', Wait.forHealthCheck())
    .up(['mongodb']);
console.log(environment)
  server = new SetupServer();
  await server.init();
  global.testRequest = supertest(server.getApp());
});

afterAll(async () => {
  await server.close();
  await environment.down();
});
