import { Context } from "elysia";
import { Span } from "@sentry/bun";
import { BaseContext } from "@apollo/server";

import type { FirebaseUser } from "@app/lib/firebase/types";

import { MaybeNil } from "@app/types/maybe.nil";
import { User } from "@app/types/user";

export type ApolloServerContext = BaseContext & {
  user: MaybeNil<User>;
  headers: Context["headers"];
  ipAddress: string;
  request: Context["request"];
  sentrySpan: Span;
  transactionID: string;
};
