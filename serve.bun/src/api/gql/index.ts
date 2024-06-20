import path from "path";
import Elysia from "elysia";
import { get } from "lodash";
import { buildSchema } from "type-graphql";
import { ApolloServer, HeaderMap } from "@apollo/server";
import { unwrapResolverError } from "@apollo/server/errors";
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from "@apollo/server/plugin/landingPage/default";

import { Env } from "@app/lib/env";
import { isAxiosError } from "@app/lib/cast.axios.error";
import { PRISMA_ERROR_CODES } from "@app/lib/prisma/error.codes";
import { isPrismaError } from "@app/lib/prisma/cast.prisma.error";

import { HealthResolver } from "./health.resolver";
import { ApolloLogPlugin } from "./_plugins/logging.plugin";
import { createApolloContext } from "./_contexts/create.context";
import { validateApolloAuth } from "./_contexts/validate.auth";
import { ApolloSentryPlugin } from "./_plugins/sentry/sentry.plugin";

const emitSchemaFile = Env.IS_DEV
  ? path.resolve(import.meta.dir, "../../../", "schema.graphql")
  : false;

const gqlSchema = await buildSchema({
  authChecker: validateApolloAuth,
  emitSchemaFile,
  resolvers: [HealthResolver],
});

const apollo = new ApolloServer({
  formatError(formattedError, error) {
    //TODO: move this
    const originalError = unwrapResolverError(error);
    if (isPrismaError(originalError)) {
      switch (originalError.code) {
        case PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT:
          return {
            message: "Record already exists",
          };
      }

      return {
        message: "Unexpected database error",
      };
    } else if (isAxiosError(originalError)) {
      return {
        message: "Unexpected HTTP error",
      };
    }

    return formattedError;
  },
  plugins: [
    ApolloLogPlugin,
    ApolloSentryPlugin,
    Env.IS_DEV
      ? ApolloServerPluginLandingPageLocalDefault({ footer: false })
      : ApolloServerPluginLandingPageProductionDefault({ footer: false }),
  ],
  schema: gqlSchema,
});

// server
function getQueryString(url: string) {
  return url.slice(url.indexOf("?", 11) + 1);
}

export const GraphqlMiddleware = new Elysia()
  .on("start", () => apollo.start())
  .all("/graphql", async (context) => {
    const method = context.request.method;
    const search = getQueryString(context.request.url);
    const body = context.body;
    const headers = context.request.headers as unknown as HeaderMap;
    const operationName = get(body, "operationName");
    const isIntrospectionQuery = operationName === "IntrospectionQuery";

    const result = await apollo.executeHTTPGraphQLRequest({
      context: () =>
        createApolloContext({
          body,
          context,
          requiredUser: !isIntrospectionQuery,
        }),
      httpGraphQLRequest: {
        body,
        headers,
        method,
        search,
      },
    });

    if (result.body.kind === "complete") {
      if (method === "GET") {
        return new Response(result.body.string, {
          headers: {
            "Content-Type": "text/html",
          },
        });
      }

      return new Response(result.body.string, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        headers: result.headers as unknown as HeadersInit,
        status: result.status ?? 200,
      });
    }
  });
