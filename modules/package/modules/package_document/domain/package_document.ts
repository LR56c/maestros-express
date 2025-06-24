import { UUID }        from "@/modules/shared/domain/value_objects/uuid"
import { ValidDate }   from "@/modules/shared/domain/value_objects/valid_date"
import { ValidString } from "@/modules/shared/domain/value_objects/valid_string"
import {
  PackageDocumentType
}                      from "@/modules/package/modules/package_document/domain/package_document_type"
import { Errors }      from "@/modules/shared/domain/exceptions/errors"
import {
  BaseException
}                      from "@/modules/shared/domain/exceptions/base_exception"
import { wrapType }    from "@/modules/shared/utils/wrap_type"

export class PackageDocument {
  private constructor(
    readonly id: UUID,
    readonly packageId: UUID,
    readonly url: ValidString,
    readonly type: PackageDocumentType,
    readonly createdAt: ValidDate
  )
  {
  }

  static create(
    id: string,
    packageId: string,
    url: string,
    type: string
  ): PackageDocument | Errors {
    return PackageDocument.fromPrimitives(
      id, packageId, url, type, ValidDate.nowUTC()
    )
  }

  static fromPrimitives(
    id: string,
    packageId: string,
    url: string,
    type: string,
    createdAt: Date | string
  ): PackageDocument | Errors {
    const errors = []

    const idVO = wrapType( () => UUID.from( id ) )
    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const packageIdVO = wrapType( () => UUID.from( packageId ) )
    if ( packageIdVO instanceof BaseException ) {
      errors.push( packageIdVO )
    }

    const urlVO = wrapType( () => ValidString.from( url ) )
    if ( urlVO instanceof BaseException ) {
      errors.push( urlVO )
    }

    const typeVO = wrapType( () => PackageDocumentType.from( type ) )
    if ( typeVO instanceof BaseException ) {
      errors.push( typeVO )
    }

    const createdAtVO = wrapType( () => ValidDate.from( createdAt ) )
    if ( createdAtVO instanceof BaseException ) {
      errors.push( createdAtVO )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new PackageDocument(
      idVO as UUID,
      packageIdVO as UUID,
      urlVO as ValidString,
      typeVO as PackageDocumentType,
      createdAtVO as ValidDate
    )
  }

  static fromPrimitivesThrow(
    id: string,
    packageId: string,
    url: string,
    type: string,
    createdAt: Date | string
  ): PackageDocument {
    return new PackageDocument(
      UUID.from( id ),
      UUID.from( packageId ),
      ValidString.from( url ),
      PackageDocumentType.from( type ),
      ValidDate.from( createdAt )
    )
  }

}