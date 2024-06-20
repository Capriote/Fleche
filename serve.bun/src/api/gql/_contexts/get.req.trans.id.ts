import { Context } from 'elysia';

import { createID } from '@app/lib/create.id';

export function getRequestTransactionID(request: Context['request']): string {
  return request.headers.get('x-transaction-id') || createID('request');
}
