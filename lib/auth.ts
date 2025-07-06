import { betterAuth }                      from "better-auth"
import { prismaAdapter }                   from "better-auth/adapters/prisma"
import prisma                              from "@/lib/prisma"
import { nextCookies }                     from "better-auth/next-js"
import { admin as adminPlugin, anonymous } from "better-auth/plugins"
import { ac, admin, client, worker }       from "./permissions"
// import { createAuthMiddleware }            from "better-auth/api"

export const auth = betterAuth( {
  emailAndPassword: {
    enabled: true
  },
  database        : prismaAdapter( prisma, {
    provider: "postgresql"
  } ),
  plugins         : [
    anonymous(),
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
    nextCookies()
  ],
  // hooks           : {
  //   after: createAuthMiddleware( async ( ctx ) => {
  //     if ( ctx.path.startsWith( "/register" ) ) {
  //       const newSession = ctx.context.newSession
  //       if ( newSession ) {
  //         throw ctx.redirect( "/" )
  //       }
  //     }
  //   } )
  // }
} )