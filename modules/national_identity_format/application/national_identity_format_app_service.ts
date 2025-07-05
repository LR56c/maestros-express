import {
  NationalIdentityFormatDTO
} from "@/modules/national_identity_format/application/national_identity_format_dto"

export abstract class NationalIdentityFormatAppService{

  abstract search( query: string ): Promise<NationalIdentityFormatDTO[]>
  abstract add( format: NationalIdentityFormatDTO ): Promise<void>
  abstract update( format: NationalIdentityFormatDTO ): Promise<void>
  abstract remove( id: string ): Promise<void>
}
