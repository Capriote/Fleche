import { Context } from "elysia";

import { MaybeNil } from "@app/types/maybe.nil";

import { User } from "@app/types/user";

// TODO: Implement
export async function getRequestUser(
  _request: Context["request"]
): Promise<MaybeNil<User>> {
  // const headers = request.headers;
  // const authorization = headers.get("Authorization") || "";
  // const token = authorization.replace("Bearer", "").trim();

  // try {
  //   assert(token, "No authentication token found!");
  //   const user = await firebase.auth().verifyIdToken(token);
  //   return user;
  // } catch (error) {
  //   if (Env.IS_DEV) {
  //     return getDevUser();
  //   }

  //   Logger.warn("Failed to get Firebase user", error);
  // }

  return null;
}
