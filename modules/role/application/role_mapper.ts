import { Errors }       from "@/modules/shared/domain/exceptions/errors"
import { wrapType }     from "@/modules/shared/utils/wrap_type"
import {
  ValidString
}                       from "@/modules/shared/domain/value_objects/valid_string"
import {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"
import type { RoleDTO } from "@/modules/role/application/role_dto"
import { Role }         from "@/modules/role/domain/role"

export class RoleMapper {
  static toDTO( role: Role ): RoleDTO {
    return {
      name: role.name.value
    }
  }

  static toJSON( role: RoleDTO ): Record<string, any> {
    return {
      name: role.name
    }
  }

  static toDomain( json: Record<string, any> ): Role | Errors {
    return Role.fromPrimitives(
      json.id,
      json.name,
      json.created_at,
      json.updated_at
    )
  }

  static fromJSON( role: Record<string, any> ): RoleDTO | Errors {
    const errors = []

    const name = wrapType( () => ValidString.from( role.name ) )

    if ( name instanceof BaseException ) {
      errors.push( name )
    }

    if ( errors.length ) {
      return new Errors( errors )
    }

    return {
      name: (
        name as ValidString
      ).value
    }
  }
}
