import 'reflect-metadata';

import './lib/sentry';

import { Elysia } from 'elysia';

import { Env } from './lib/env';
import { Logger } from './lib/logger';
import { RestMiddleware } from './api/rest';
import { GraphqlMiddleware } from './api/gql';

const app = new Elysia();

app.use(GraphqlMiddleware);
app.use(RestMiddleware);

app.listen(Env.get('PORT'), server => {
  if (Env.IS_DEV) {
    Logger.info(`Server listening on http://localhost:${server.port}/graphql`);
  }
});
