import { z } from "zod"

export const oauthRequestSchema = z.object( {
  token      : z.string(),
  name       : z.string().optional(),
  method: z.string()
} )

export type OauthRequest = z.infer<typeof oauthRequestSchema>
