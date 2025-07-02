"use server"

import { actionClient } from "@/lib/safe-action"
import { isLeft }       from "fp-ts/Either"
import { AuthMapper }   from "@/modules/auth/application/auth_mapper"
import {
  authLoginRequestSchema
}                       from "@/modules/auth/application/auth_login_request"
import {
  SupabaseAuthData
}                       from "@/modules/auth/infrastructure/supabase_auth_data"
import { supabase }     from "@/app/api/dependencies"
import { LoginAuth }    from "@/modules/auth/application/login_auth"

const supabaseDao = new SupabaseAuthData( await supabase() )
const login = new LoginAuth(supabaseDao)
export const loginAuth = actionClient.inputSchema(
  authLoginRequestSchema )
                                        .action(
                                          async ( { parsedInput: dto } ) => {

                                            const result = await login.execute( dto )

                                            if ( isLeft( result ) ) {
                                              return {
                                                error: true
                                              }
                                            }
                                            return {
                                              data : AuthMapper.toDTO(
                                                result.right ),
                                              error: false
                                            }
                                          }
                                        )
