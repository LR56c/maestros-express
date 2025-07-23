import { Package }  from "@/modules/package/domain/package"
import {
  PackageResponse
}                   from "@/modules/package/application/package_response"
import {
  Errors
}                   from "@/modules/shared/domain/exceptions/errors"
import { wrapType } from "@/modules/shared/utils/wrap_type"
import {
  UUID
}                   from "@/modules/shared/domain/value_objects/uuid"
import {
  BaseException
}                   from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidDate
}                   from "@/modules/shared/domain/value_objects/valid_date"
import {
  ValidString
}                   from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidDecimal
}                   from "@/modules/shared/domain/value_objects/valid_decimal"
import {
  PackageDocumentMapper
}                   from "@/modules/package/modules/package_document/application/package_document_mapper"
import {
  PackageDocumentDTO
}                   from "@/modules/package/modules/package_document/application/package_document_dto"
import {
  PackageDocument
}                   from "@/modules/package/modules/package_document/domain/package_document"

export class PackageMapper {
  static toDTO( entity: Package ): PackageResponse {
    return {
      id            : entity.id.toString(),
      name          : entity.name.value,
      description   : entity.description.value,
      specification : entity.specification.value,
      value         : entity.value.value,
      review_count  : entity.reviewCount.value,
      review_average: entity.reviewAverage.value,
      cover_url     : entity.coverUrl.value,
      value_format  : entity.valueFormat.value,
      documents     : entity.documents.map( PackageDocumentMapper.toDTO ),
      created_at    : entity.createdAt.toString()
    }
  }

  static toJSON( dto: PackageResponse ): Record<string, any> {
    return {
      id            : dto.id,
      name          : dto.name,
      description   : dto.description,
      specification : dto.specification,
      value         : dto.value,
      review_count  : dto.review_count,
      review_average: dto.review_average,
      cover_url     : dto.cover_url,
      value_format  : dto.value_format,
      documents     : dto.documents.map( PackageDocumentMapper.toJSON ),
      created_at    : dto.created_at
    }
  }

  static fromJSON( json: Record<string, any> ): PackageResponse | Errors {
    const errors = []

    const id = wrapType(
      () => UUID.from( json.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const name = wrapType(
      () => ValidString.from( json.name ) )

    if ( name instanceof BaseException ) {
      errors.push( name )
    }

    const description = wrapType(
      () => ValidString.from( json.description ) )

    if ( description instanceof BaseException ) {
      errors.push( description )
    }

    const specification = wrapType(
      () => ValidString.from( json.specification ) )

    if ( specification instanceof BaseException ) {
      errors.push( specification )
    }

    const value = wrapType(
      () => ValidDecimal.from( json.value ) )

    if ( value instanceof BaseException ) {
      errors.push( value )
    }

    const reviewCount = wrapType(
      () => ValidDecimal.from( json.review_count ) )

    if ( reviewCount instanceof BaseException ) {
      errors.push( reviewCount )
    }

    const reviewAverage = wrapType(
      () => ValidDecimal.from( json.review_average ) )

    if ( reviewAverage instanceof BaseException ) {
      errors.push( reviewAverage )
    }

    const coverUrl = wrapType(
      () => ValidString.from( json.cover_url ) )

    if ( coverUrl instanceof BaseException ) {
      errors.push( coverUrl )
    }

    const valueFormat = wrapType(
      () => ValidString.from( json.value_format ) )

    if ( valueFormat instanceof BaseException ) {
      errors.push( valueFormat )
    }

    const createdAt = wrapType(
      () => ValidDate.from( json.created_at ) )

    if ( createdAt instanceof BaseException ) {
      errors.push( createdAt )
    }

    const documents: PackageDocumentDTO[] = []
    for ( const document of json.documents ) {
      const documentResult = PackageDocumentMapper.fromJSON( document )
      if ( documentResult instanceof Errors ) {
        errors.push( ...documentResult.values )
      }
      else {
        documents.push( documentResult )
      }
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id            : (
        id as UUID
      ).toString(),
      name          : (
        name as ValidString
      ).value,
      description   : (
        description as ValidString
      ).value,
      specification : (
        specification as ValidString
      ).value,
      value         : (
        value as ValidDecimal
      ).value,
      review_count  : (
        reviewCount as ValidDecimal
      ).value,
      review_average: (
        reviewAverage as ValidDecimal
      ).value,
      cover_url     : (
        coverUrl as ValidString
      ).value,
      value_format  : (
        valueFormat as ValidString
      ).value,
      documents     : documents,
      created_at    : (
        createdAt as ValidDate
      ).toString()
    }
  }

  static toDomain( json: Record<string, any> ): Package | Errors {

    const docs: PackageDocument[] = []
    for ( const doc of json.documents ) {
      const docErrors = PackageDocumentMapper.toDomain( doc )
      if ( docErrors instanceof Errors ) {
        return docErrors
      }
      docs.push( docErrors )
    }

    return Package.fromPrimitives(
      json.id,
      json.worker_id,
      json.name,
      json.description,
      json.specification,
      json.value,
      json.review_count,
      json.review_average,
      json.cover_url,
      json.value_format,
      docs,
      json.created_at
    )
  }
}
