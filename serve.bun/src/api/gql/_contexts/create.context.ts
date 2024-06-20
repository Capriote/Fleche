import { Context } from "elysia";

import { Sentry } from "@app/lib/sentry";

import { ApolloServerContext } from "./types";
import { getRequestUser } from "./get.request.user";
import { getRequestIpAddress } from "./get.req.ip";
import { getRequestTransactionID } from "./get.req.trans.id";

export async function createApolloContext(params: {
  body: unknown;
  context: Context;
  requiredUser: boolean;
}): Promise<ApolloServerContext> {
  const { context, requiredUser = true } = params;
  const request = context.request;
  const headers = context.headers;

  const user = requiredUser ? await getRequestUser(request) : null;
  const transactionID = getRequestTransactionID(request);
  const ipAddress = getRequestIpAddress(request);
  const sentrySpan = Sentry.startInactiveSpan({
    name: "GraphQLTransaction",
    op: "GraphQL",
  })!;

  return {
    headers,
    ipAddress,
    request,
    sentrySpan,
    transactionID,
    user,
  };
}
