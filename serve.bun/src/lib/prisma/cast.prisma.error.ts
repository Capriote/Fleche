import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const isPrismaError = (
  error: unknown
): error is PrismaClientKnownRequestError => {
  return error instanceof PrismaClientKnownRequestError;
};

export const castPrismaError = (error: unknown) => {
  return error as PrismaClientKnownRequestError;
};
