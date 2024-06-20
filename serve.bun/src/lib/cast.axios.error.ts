/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */

export function castAxiosError<T>(error: any) {
  if ('response' in error) {
    return error.response?.data as T;
  }

  return error as T;
}

export function isAxiosError(error: any): boolean {
  return 'response' in error;
}
