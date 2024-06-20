import { User } from '@app/types/user';

export async function getDevUser(): Promise<User> {
  await Promise.resolve();
  // const user = await prisma.user.findFirst({ select: { id: true } });

  return {
    displayName: 'Dev User',
    email: 'dev@dev',
    id: 'dev',
  };
}
