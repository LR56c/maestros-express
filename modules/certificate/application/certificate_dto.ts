import { z }            from "zod"

export const certificateSchema = z.object( {
  id      : z.string(),
  worker_id: z.string(),
  name    : z.string(),
  url     : z.string(),
  type    : z.string()
} )

export type CertificateDTO = z.infer<typeof certificateSchema>

