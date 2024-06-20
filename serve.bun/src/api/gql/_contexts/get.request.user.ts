import { Context } from 'elysia';

import { User } from '@app/types/user';
import { MaybeNil } from '@app/types/maybe.nil';

// TODO: Implement
export async function getRequestUser(
  _request: Context['request'],
): Promise<MaybeNil<User>> {
  await Promise.resolve(_request);
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
