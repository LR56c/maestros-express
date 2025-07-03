import { createAccessControl } from "better-auth/plugins/access"
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  client: ["control"],
  worker: ["control"],
} as const

export const ac = createAccessControl( statement )

export const client = ac.newRole( {
  client: ["control"],
} )

export const admin = ac.newRole( {
  client: ["control"],
  worker: ["control"],
  ...adminAc.statements,
} )

export const worker = ac.newRole( {
  worker: ["control"],
} )