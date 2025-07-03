"use server"

import { BetterAuthWithPrismaNextjsUserData } from "@/modules/user/infrastructure/better_auth_with_prisma_nextjs_user_data"
import { actionClient }                       from "@/lib/safe-action"
import { isLeft }    from "fp-ts/Either"
import { LoginUser } from "@/modules/user/application/auth_use_cases/login_user"
import {
  userLoginRequestSchema
}                    from "@/modules/user/application/models/user_login_request"
import prisma                           from "@/lib/prisma"

const betterAuthData = new BetterAuthWithPrismaNextjsUserData(prisma)

const login = new LoginUser( betterAuthData )

export const loginUser = actionClient
  .inputSchema( userLoginRequestSchema )
                                     .action(
                                          async ( { parsedInput: dto } ) => {
                                            const result = await login.execute( dto )

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
