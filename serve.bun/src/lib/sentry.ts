import { isEmpty } from "lodash";
import * as _Sentry from "@sentry/bun";

import { Env } from "@app/lib/env";
import { Logger } from "@app/lib/logger";

const logger = Logger.getSubLogger({ name: "Sentry" });
const NODE_ENV = Env.getOptional("NODE_ENV") || "development";
const SENTRY_DSN = Env.getOptional("SENTRY_DSN");
const isEnabled = !isEmpty(SENTRY_DSN);

logger.info("Sentry status: %s", isEnabled ? "enabled" : "disabled");

_Sentry.init({
  dsn: SENTRY_DSN,
  enabled: isEnabled,
  environment: Env.getOptional("NODE_ENV") ?? "development",
  // @see https://github.com/oven-sh/bun/issues/7472
  integrations: (int) =>
    int.filter((i) => !["BunServer", "Http"].includes(i.name)),
  release: process.env.COMMIT_SHA || NODE_ENV,
  tracesSampleRate: 1.0,
});

export const Sentry = _Sentry;
