import { z } from "zod"

export const userProfileUpdateSchema = z.object( {
  avatar: z.string().optional(),
} )

export type UserProfileUpdateDTO = z.infer<typeof userProfileUpdateSchema>
