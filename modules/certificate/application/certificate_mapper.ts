import { Certificate }     from "@/modules/certificate/domain/certificate"
import {
  CertificateDTO
}                          from "@/modules/certificate/application/certificate_dto"
import { Errors }          from "@/modules/shared/domain/exceptions/errors"
import { wrapType }        from "@/modules/shared/utils/wrap_type"
import { UUID }            from "@/modules/shared/domain/value_objects/uuid"
import {
  BaseException
}                          from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidString
}                          from "@/modules/shared/domain/value_objects/valid_string"
import { CertificateType } from "@/modules/certificate/domain/certificate_type"

export class CertificateMapper {
  static toDTO( certificate: Certificate ): CertificateDTO {
    return {
      id      : certificate.id.value,
      worker_id: certificate.workerId.value,
      name    : certificate.name.value,
      url     : certificate.url.value,
      type    : certificate.type.value
    }
  }

  static toJSON( certificate: CertificateDTO ): Record<string, any> {
    return {
      id      : certificate.id,
      worker_id: certificate.worker_id,
      name    : certificate.name,
      url     : certificate.url,
      type    : certificate.type
    }
  }

  static fromJSON( certificate: Record<string, any> ): CertificateDTO | Errors {
    const errors = []

    const id = wrapType(
      () => UUID.from( certificate.id ) )

    if ( id instanceof BaseException ) {
      errors.push( id )
    }

    const workerId = wrapType(
      () => UUID.from( certificate.workerId ) )

    if ( workerId instanceof BaseException ) {
      errors.push( workerId )
    }

    const name = wrapType(
      () => ValidString.from( certificate.name ) )

    if ( name instanceof BaseException ) {
      errors.push( name )
    }

    const url = wrapType(
      () => ValidString.from( certificate.url ) )

    if ( url instanceof BaseException ) {
      errors.push( url )
    }

    const type = wrapType(
      () => CertificateType.from( certificate.type ) )

    if ( type instanceof BaseException ) {
      errors.push( type )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      id      : (
        id as UUID
      ).value,
      worker_id: (
        workerId as UUID
      ).value,
      name    : (
        name as ValidString
      ).value,
      url     : (
        url as ValidString
      ).value,
      type    : (
        type as CertificateType
      ).value
    }
  }


  static toDomain(json: Record<string, any>): Certificate | Errors {
    return Certificate.fromPrimitives(
      json.id,
      json.worker_id,
      json.name,
      json.url,
      json.type,
      json.createdAt
    )
  }
}