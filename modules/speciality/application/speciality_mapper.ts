import { Speciality } from "@/modules/speciality/domain/speciality"
import { SpecialityDTO } from "@/modules/speciality/application/speciality_dto"
import { Errors } from "@/modules/shared/domain/exceptions/errors"
import { wrapType } from "@/modules/shared/utils/wrap_type"
import { UUID } from "@/modules/shared/domain/value_objects/uuid"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import { ValidString } from "@/modules/shared/domain/value_objects/valid_string"

export class SpecialityMapper {
  static toDTO( speciality: Speciality ): SpecialityDTO {
    return {
      id        : speciality.id.toString(),
      name        : speciality.name.value,
    }
  }

  static toJSON( speciality: SpecialityDTO ): Record<string, any> {
    return {
      id        : speciality.id,
      name        : speciality.name,
    }
  }

  static fromJSON( speciality: Record<string, any> ): SpecialityDTO | Errors {
    const errors = []

    const id = wrapType(
      () => UUID.from( speciality.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const name = wrapType(
      () => ValidString.from( speciality.name ) )

    if ( name instanceof BaseException ) {
      errors.push( name )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id        : ( id as UUID ).toString(),
      name        : ( name as ValidString ).value,
    }
  }

  static toDomain( json: Record<string, any> ): Speciality | Errors {
    return Speciality.fromPrimitives(
      json.id,
      json.name,
      json.created_at,
    )
  }
}