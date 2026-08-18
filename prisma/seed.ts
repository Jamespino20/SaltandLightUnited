import { PrismaClient, Role } from "@prisma/client";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const prisma = new PrismaClient();
const scryptAsync = promisify(scrypt);

async function hash(plain: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(plain, salt, 64)) as Buffer;
  return `${salt}:${buf.toString("hex")}`;
}

const DEFAULT_ROLES = [
  {
    name: "admin",
    displayName: "Administrator",
    permissions: [
      "events:create", "events:read", "events:update", "events:delete",
      "devotionals:create", "devotionals:read", "devotionals:update", "devotionals:delete",
      "testimonies:create", "testimonies:read", "testimonies:update", "testimonies:delete", "testimonies:approve",
      "groups:create", "groups:read", "groups:update", "groups:delete",
      "pubmats:create", "pubmats:read", "pubmats:update", "pubmats:delete",
      "users:read", "users:create", "users:update", "users:delete",
      "roles:read", "roles:create", "roles:update", "roles:delete",
      "audit:read",
      "settings:read", "settings:update",
    ],
    isDefault: false,
    isSystem: true,
  },
  {
    name: "editor",
    displayName: "Editor",
    permissions: [
      "events:create", "events:read", "events:update", "events:delete",
      "devotionals:create", "devotionals:read", "devotionals:update", "devotionals:delete",
      "testimonies:read", "testimonies:update", "testimonies:approve",
      "groups:create", "groups:read", "groups:update", "groups:delete",
      "pubmats:create", "pubmats:read", "pubmats:update", "pubmats:delete",
      "users:read",
      "audit:read",
    ],
    isDefault: true,
    isSystem: true,
  },
  {
    name: "viewer",
    displayName: "Viewer",
    permissions: [
      "events:read",
      "devotionals:read",
      "testimonies:read",
      "groups:read",
      "pubmats:read",
      "users:read",
      "audit:read",
    ],
    isDefault: false,
    isSystem: true,
  },
];

async function main() {
  const email = (process.env.ADMIN_EMAIL ?? "espino.jamesbryant20@gmail.com")
    .toLowerCase()
    .trim();
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const name = process.env.ADMIN_NAME ?? "SLU Admin";
  const role = (process.env.ADMIN_ROLE ?? "admin") as Role;

  const passwordHash = await hash(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, role, passwordHash },
    create: { email, name, role, passwordHash },
  });

  console.log(`Seeded admin user: ${user.email} (role: ${user.role})`);

  for (const roleConfig of DEFAULT_ROLES) {
    await prisma.roleConfig.upsert({
      where: { name: roleConfig.name },
      update: {
        displayName: roleConfig.displayName,
        permissions: roleConfig.permissions,
        isDefault: roleConfig.isDefault,
        isSystem: roleConfig.isSystem,
      },
      create: roleConfig,
    });
    console.log(`Seeded role: ${roleConfig.displayName} (${roleConfig.name})`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
