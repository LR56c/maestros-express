import {
  PackageDocument
} from "@/modules/package/modules/package_document/domain/package_document"
import {
  PackageDocumentDTO
} from "@/modules/package/modules/package_document/application/package_document_dto"
import { Errors } from "@/modules/shared/domain/exceptions/errors"
import { wrapType } from "@/modules/shared/utils/wrap_type"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import { UUID } from "@/modules/shared/domain/value_objects/uuid"
import { ValidString } from "@/modules/shared/domain/value_objects/valid_string"
import {
  PackageDocumentType
} from "@/modules/package/modules/package_document/domain/package_document_type"
import { Zone } from "@/modules/zone/domain/zone"

export class PackageDocumentMapper {
  static toDTO( packageDocument: PackageDocument ): PackageDocumentDTO {
    return{
      id: packageDocument.id.toString(),
      url: packageDocument.url.value,
      type: packageDocument.type.value,
    }
  }
  static toJSON( packageDocument: PackageDocumentDTO ): Record<string, any> {
    return {
      id: packageDocument.id,
      url: packageDocument.url,
      type: packageDocument.type,
    }
  }

  static fromJSON( json: Record<string, any> ): PackageDocumentDTO | Errors {
    const errors = []

    const id = wrapType( () => UUID.from( json.id ) )
    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const url = wrapType( () => ValidString.from( json.url ) )
    if ( url instanceof BaseException ) {
      errors.push( url )
    }

    const type = wrapType( () => PackageDocumentType.from( json.type ) )
    if ( type instanceof BaseException ) {
      errors.push( type )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id: ( id as UUID ).toString(),
      url: ( url as ValidString ).value,
      type: ( type as ValidString ).value,
    }
  }

  static toDomain( json: Record<string, any> ): PackageDocument | Errors {
    return PackageDocument.fromPrimitives(
      json.id,
      json.package_id,
      json.url,
      json.type,
      json.created_at,
    )
  }
}