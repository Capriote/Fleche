import { createID } from "@app/lib/create.id";
import { Context } from "elysia";

export function getRequestTransactionID(request: Context["request"]): string {
  return request.headers.get("x-transaction-id") || createID("request");
}
