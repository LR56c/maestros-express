import { z } from "zod"


export const querySchema = z
  .object( {
    limit    : z.coerce.number().nullish(),
    skip     : z.string().nullish(),
    sort_by  : z.string().nullish(),
    sort_type: z.string().nullish()
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
