import {
  PhoneFormatDTO
} from "@/modules/phone_format/application/phone_format_dto"

export abstract class PhoneFormatAppService{

  abstract search( query: string ): Promise<PhoneFormatDTO[]>
  abstract add( format: PhoneFormatDTO ): Promise<void>
  abstract update( format: PhoneFormatDTO ): Promise<void>
  abstract remove( id: string ): Promise<void>
}
