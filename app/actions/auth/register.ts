"use server"

import { BetterAuthWithPrismaNextjsUserData } from "@/modules/user/infrastructure/better_auth_with_prisma_nextjs_user_data"
import {
  RegisterUser
}                                             from "@/modules/user/application/use_cases/register_user"
import { actionClient }   from "@/lib/safe-action"
import {
  userRegisterRequestSchema
} from "@/modules/user/application/models/user_register_request"
import { isLeft }         from "fp-ts/Either"
import { UserMapper }     from "@/modules/user/application/user_mapper"
import prisma                           from "@/lib/prisma"

const betterAuthData = new BetterAuthWithPrismaNextjsUserData(prisma)

const register = new RegisterUser( betterAuthData )

export const registerUser = actionClient.inputSchema(
  userRegisterRequestSchema )
                                        .action(
                                          async ( { parsedInput: dto } ) => {

                                            const result = await register.execute( dto )

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
