"use server"

import { actionClient }      from "@/lib/safe-action"
import { supabase } from "@/app/api/dependencies"
import {
  authRegisterRequestSchema
} from "@/modules/auth/application/auth_register_request"
import {
  SupabaseAuthData
}                            from "@/modules/auth/infrastructure/supabase_auth_data"

export const registerAuth = actionClient.inputSchema( authRegisterRequestSchema )
                                          .action(
                                            async ( { parsedInput: dto } ) => {
                                              // const supabaseDao = new SupabaseAuthData( await supabase() )
                                              // const result = await supabaseDao.register( dto )
                                              // console.log("Supabase update user result:", data, error)
                                              return true
                                            }
                                          )
