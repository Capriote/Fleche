import * as TsLog from 'tslog';

import { Env } from '@app/lib/env';

export const LOG_LEVEL = {
  debug: 2,
  error: 5,
  fatal: 6,
  info: 3,
  silly: 0,
  trace: 1,
  warn: 4,
} satisfies Record<string, number>;

const minLevel = LOG_LEVEL.debug;

export const Logger = new TsLog.Logger({
  minLevel: minLevel,
  name: 'App',
  overwrite: {
    addPlaceholders: (logObjMeta, placeholderValues) => {
      placeholderValues['filePathWithLine'] =
        logObjMeta.path?.filePathWithLine?.replace('/', '') ?? '';
    },
  },
  prettyLogTemplate:
    '\n{{rawIsoStr}} {{logLevelName}} {{name}} {{filePathWithLine}}\n',
  stylePrettyLogs: Env.IS_DEV,
  type: 'pretty',
});
