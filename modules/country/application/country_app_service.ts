import { type CountryDTO } from "./country_dto"

export abstract class CountryAppService {
  abstract search( queryUrl: string ): Promise<CountryDTO[]>
}
