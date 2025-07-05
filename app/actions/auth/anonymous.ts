"use server"

import {
  BetterAuthWithPrismaNextjsUserData
}                       from "@/modules/user/infrastructure/better_auth_with_prisma_nextjs_user_data"
import { actionClient } from "@/lib/safe-action"
import { isLeft }       from "fp-ts/Either"
import prisma           from "@/lib/prisma"
import {
  LoginAnonymous
}                       from "@/modules/user/application/auth_use_cases/login_anonymous"

const betterAuthData = new BetterAuthWithPrismaNextjsUserData( prisma )

const anon = new LoginAnonymous( betterAuthData )

export const loginAnonymous = actionClient
  .action(
    async () => {
      const result = await anon.execute()

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
