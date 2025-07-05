import { betterAuth }                      from "better-auth"
import { prismaAdapter }                   from "better-auth/adapters/prisma"
import prisma                              from "@/lib/prisma"
import { nextCookies }                     from "better-auth/next-js"
import { admin as adminPlugin, anonymous } from "better-auth/plugins"
import { ac, admin, client, worker }       from "./permissions"

export const auth = betterAuth( {
  emailAndPassword: {
    enabled: true
  },
  database        : prismaAdapter( prisma, {
    provider: "postgresql"
  } ),
  plugins         : [
    anonymous(),
    nextCookies(),
    adminPlugin( {
      adminRoles : ["admin"],
      defaultRole: "client",
      ac,
      roles      : {
        admin,
        worker,
        client
      }
    } ),
  ]
} )