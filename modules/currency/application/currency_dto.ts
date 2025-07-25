import { z } from "zod"

export const currencySchema = z.object( {
  code        : z.string(),
  name        : z.string(),
  symbol      : z.string(),
  country_code: z.string(),
  decimals    : z.coerce.number().int()
} )

export type CurrencyDTO = z.infer<typeof currencySchema>

