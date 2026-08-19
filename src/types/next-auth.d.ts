import { DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role?: Role;
    avatarUrl?: string | null;
    phone?: string | null;
    bio?: string | null;
  }
  interface Session {
    user: {
      id: string;
      role: Role;
      permissions: string[];
      avatarUrl?: string | null;
      phone?: string | null;
      bio?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: Role;
    permissions?: string[];
    avatarUrl?: string | null;
    phone?: string | null;
    bio?: string | null;
  }
}
