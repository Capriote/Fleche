import { User } from "@app/types/user";

export async function getDevUser(): Promise<User> {
  // const user = await prisma.user.findFirst({ select: { id: true } });

  return {
    id: "dev",
  };
}
