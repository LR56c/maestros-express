import { SpecialityDTO } from "@/modules/speciality/application/speciality_dto"

export abstract class SpecialityAppService {
  abstract add( speciality: SpecialityDTO ): Promise<void>

  abstract update( speciality: SpecialityDTO ): Promise<void>

  abstract remove( id: string ): Promise<void>

  abstract search( query: string ): Promise<SpecialityDTO[]>
}