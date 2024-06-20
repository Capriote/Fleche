import { isNil } from "lodash";

type Keys =
  | "DATABASE_URL"
  | "NODE_ENV"
  | "PORT"
  | "SERVER"
  | "SENTRY_DSN"
  | "GROQ_API_KEY";

export class Env {
  static get IS_DEV() {
    return isNil(this.NODE_ENV) || this.NODE_ENV === "development";
  }

  static get IS_TEST() {
    return this.NODE_ENV === "test";
  }

  static get<T extends boolean = true>(
    key: Keys,
    required = !this.IS_TEST
  ): T extends true ? string : undefined {
    const value = process.env[key];
    if (required && isNil(value)) {
      throw new Error(`Missing environment variable: ${key}`);
    }

    return value as T extends true ? string : undefined;
  }

  static getOptional(key: Keys) {
    return this.get(key, false);
  }

  private static get NODE_ENV() {
    return process.env.NODE_ENV ?? "development";
  }
}
