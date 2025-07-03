"use server"

import { BetterAuthWithPrismaNextjsUserData } from "@/modules/user/infrastructure/better_auth_with_prisma_nextjs_user_data"
import { actionClient }                       from "@/lib/safe-action"
import { isLeft }         from "fp-ts/Either"
import {
  LogoutUser
}                         from "@/modules/user/application/use_cases/logout_user"
import prisma                           from "@/lib/prisma"

const betterAuthData = new BetterAuthWithPrismaNextjsUserData(prisma)

const logout = new LogoutUser( betterAuthData )

export const logoutUser = actionClient
                                     .action(
                                       async (  ) => {
                                         const result = await logout.execute()
                                         if ( isLeft( result ) ) {
                                           return {
                                             error: true
                                           }
                                         }
                                         return {
                                           error: false
                                         }
                                       }
                                     )
