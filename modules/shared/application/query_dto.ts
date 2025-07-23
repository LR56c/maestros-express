import { z } from "zod"


export const querySchema = z
  .object( {
    limit    : z.coerce.number().optional(),
    skip     : z.string().optional(),
    sort_by  : z.string().optional(),
    sort_type: z.string().optional()
  } )
  .passthrough()
  .transform( ( { limit, skip, sort_type, sort_by, ...rest } ) => (
    {
      limit,
      skip,
      sort_type,
      sort_by,
      query: rest
    }
  ) )

export type QueryDTO = z.infer<typeof querySchema>
