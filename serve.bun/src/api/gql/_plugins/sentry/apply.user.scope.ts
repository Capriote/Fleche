import { MaybeNil } from "@app/types/maybe.nil";
import { User } from "@app/types/user";
import * as Sentry from "@sentry/bun";

export function applyUserScopeToSentry(user?: MaybeNil<User>) {
  if (!user) {
    return;
  }

  Sentry.getCurrentScope().setUser({
    email: user.email,
    id: user.id,
    name: user.displayName,
  });
}
