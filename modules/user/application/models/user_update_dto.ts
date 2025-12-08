import { z } from "zod"

export const userUpdateSchema = z.object( {
  email : z.string().email(),
  avatar: z.string().nullish(),
  status: z.string().nullish(),
  role: z.string().nullish(),
} )

export type UserUpdateDTO = z.infer<typeof userUpdateSchema>
