import { z } from "zod"

export const userUpdateSchema = z.object( {
  avatar : z.string().optional(),
  roles: z.union( [z.array( z.string() ).optional(), z.null()] )
} ).refine( data =>
    Object.values( data ).some( value => value !== undefined ),
  {
    message: "At least one field must be present"
  }
)

export type UserUpdateDTO = z.infer<typeof userUpdateSchema>
