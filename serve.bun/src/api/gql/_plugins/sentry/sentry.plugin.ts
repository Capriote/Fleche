import assert from "assert";
import { Scope } from "@sentry/bun";
import { ApolloServerPlugin } from "@apollo/server";

import { Sentry } from "@app/lib/sentry";

import { applyIpScopeToSentry } from "./apply.ip.scope";
import { ApolloServerContext } from "../../_contexts/types";
import { applyUserScopeToSentry } from "./apply.user.scope";

export const ApolloSentryPlugin: ApolloServerPlugin<ApolloServerContext> = {
  async requestDidStart(context) {
    assert(context.contextValue.sentrySpan, "Context has no sentrySpan");
    applyIpScopeToSentry(context.contextValue.ipAddress);
    applyUserScopeToSentry(context.contextValue?.user);

    if (context.operationName) {
      context.contextValue.sentrySpan.updateName(context.operationName);
    }

    return Promise.resolve({
      async didEncounterErrors({ errors, operation, request }) {
        if (!operation) {
          for (const error of errors) {
            Sentry.withScope((scope) => {
              scope.setExtra("query", request.query);
              Sentry.captureException(error);
            });
          }

          return Promise.resolve();
        }

        for (const error of errors) {
          Sentry.withScope((scope: Scope) => {
            scope.setTag("transactionID", context.contextValue.transactionID);
            scope.setTag("kind", operation.operation);
            scope.setExtra("query", request.query);
            scope.setExtra("variables", request.variables);

            if (error.path) {
              scope.addBreadcrumb({
                category: "query-path",
                level: "debug",
                message: error.path.join(" > "),
              });
            }

            Sentry.captureException(error);
          });
        }

        return Promise.resolve();
      },
      async executionDidStart() {
        return Promise.resolve({
          willResolveField({ contextValue, info }) {
            const span = contextValue.sentrySpan.startChild({
              description: `${info.parentType.name}.${info.fieldName}`,
              op: "resolver",
            });

            return () => {
              span.end();
            };
          },
        });
      },
      async willSendResponse({ response }) {
        context.contextValue.sentrySpan.end();
        response.http.headers.set(
          "X-Transaction-ID",
          context.contextValue.transactionID
        );

        return Promise.resolve();
      },
    });
  },
};
