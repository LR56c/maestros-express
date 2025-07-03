"use server"

import {
  BetterAuthWithPrismaNextjsUserData
}                        from "@/modules/user/infrastructure/better_auth_with_prisma_nextjs_user_data"
import { actionClient }  from "@/lib/safe-action"
import { UpdateUser }    from "@/modules/user/application/use_cases/update_user"
import prisma            from "@/lib/prisma"
import { checkRole }     from "@/utils/check_role"
import { RoleLevelType } from "@/modules/user/domain/role_type"
import { isLeft }        from "fp-ts/Either"
import {
  userUpdateSchema
} from "@/modules/user/application/models/user_update_dto"

const betterAuthData = new BetterAuthWithPrismaNextjsUserData( prisma )

const update = new UpdateUser( betterAuthData )

export const updateUser = actionClient
  .inputSchema(userUpdateSchema)
  .action(
    async ( { parsedInput: dto } ) => {
      const permit = await checkRole( RoleLevelType.CLIENT )
      if ( !permit ) {
        return {
          error: false
        }
      }
      const result = await update.execute(dto)

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
