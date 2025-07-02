"use server"

import { actionClient } from "@/lib/safe-action"
import { supabase }     from "@/app/api/dependencies"


export const logoutAuth = actionClient
  // .inputSchema(z.object({}))
  .action(
    // async ( { parsedInput: dto } ) => {
    async () => {
      const sup             = await supabase()
      const { data, error } = await sup.auth.getUser()
      // const supabaseDao = new SupabaseAuthData( sup )
      // const logout      = new LogoutAuth( supabaseDao )
      // const result = await logout.execute( dto )
      // if ( isLeft( result ) ) {
      //   return {
      //     error: true
      //   }
      // }
      // return {
      //   error: false
      // }
    }
  )
