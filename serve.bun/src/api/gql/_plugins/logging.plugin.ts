import moment from "moment";
import { Kind } from "graphql/language/kinds";
import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
} from "@apollo/server";

import { Env } from "@app/lib/env";
import { Logger } from "@app/lib/logger";

import { ApolloServerContext } from "../_contexts/types";

const logger = Logger.getSubLogger({ name: "Apollo Log" });

function getOps(context: GraphQLRequestContext<BaseContext>) {
  if (!context.document) {
    return null;
  }

  const operations: string[] = [];
  for (const def of context.document.definitions) {
    if (def.kind === Kind.OPERATION_DEFINITION) {
      for (const selection of def.selectionSet.selections) {
        if (selection.kind === Kind.FIELD) {
          operations.push(selection.name.value);
        }
      }
    }
  }

  return operations;
}

export const ApolloLogPlugin: ApolloServerPlugin<ApolloServerContext> = {
  async requestDidStart(requestContext) {
    const start = new Date();
    const request = requestContext.request;
    const query = request.query;
    const op = request.operationName;

    let shouldLog = false;

    if (op !== "IntrospectionQuery" && !query?.includes("IntrospectionQuery")) {
      shouldLog = Env.IS_DEV;
    }

    return Promise.resolve({
      didEncounterErrors(requestContext) {
        const gqlError = requestContext.errors[0];
        const originalError = gqlError.originalError;
        const transactionID = requestContext.contextValue.transactionID;
        // const userID = requestContext.contextValue.user?.uid ?? "UNKNOWN";

        // TODO: Add auth
        const userID = "UNKNOWN";

        logger.error(
          "User=%s Op=%s Transaction=%s",
          userID,
          getOps(requestContext),
          transactionID
        );

        logger.error({
          error: originalError,
          gqlError,
        });

        return Promise.resolve();
      },
      willSendResponse(context) {
        if (!shouldLog) {
          return Promise.resolve();
        } else if (context.errors) {
          return Promise.resolve();
        }

        const duration = moment.duration(moment().diff(start));
        // const userID = context.contextValue.user?.uid ?? "UNKNOWN";
        // TODO: Add auth
        const userID = "UNKNOWN";

        logger.debug(
          "User=%s Op=%s Duration=%sms",
          userID,
          getOps(requestContext),
          duration.asMilliseconds()
        );

        return Promise.resolve();
      },
    });
  },
};
