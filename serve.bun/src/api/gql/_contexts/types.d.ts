import { Context } from 'elysia';
import { Span } from '@sentry/bun';
import { BaseContext } from '@apollo/server';

import { User } from '@app/types/user';
import { MaybeNil } from '@app/types/maybe.nil';

export type ApolloServerContext = {
  headers: Context['headers'];
  ipAddress: string;
  request: Context['request'];
  sentrySpan: Span;
  transactionID: string;
  user: MaybeNil<User>;
} & BaseContext;
