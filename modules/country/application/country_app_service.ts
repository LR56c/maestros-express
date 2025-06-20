import { type CountryDTO } from "./country_dto"

export abstract class CountryAppService {
  abstract search( queryUrl: string ): Promise<CountryDTO[]>

  abstract add( country: CountryDTO ): Promise<void>

  abstract update( country: CountryDTO ): Promise<void>

  abstract remove( id: string ): Promise<void>
}
