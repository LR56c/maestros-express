import { CertificateDAO }              from "@/modules/certificate/domain/certificate_dao"
import {
  Certificate
}                                      from "@/modules/certificate/domain/certificate"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  CertificateDTO
}                                      from "@/modules/certificate/application/certificate_dto"
import {
  GetCertificateByWorker
}                                      from "@/modules/certificate/application/get_certificate_by_worker"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import { wrapType }                    from "@/modules/shared/utils/wrap_type"
import {
  UUID
}                                      from "@/modules/shared/domain/value_objects/uuid"

export class UpsertCertificates {
  constructor(
    private readonly dao: CertificateDAO,
    private readonly getCertificates: GetCertificateByWorker
  )
  {
  }

  private async ensureCertificatesExist( workerId: string,
    certificatee: CertificateDTO[] ): Promise<Either<BaseException[], Certificate[]>> {
    const existResult = await this.getCertificates.execute( workerId )
    if ( isLeft( existResult ) ) {
      return left( existResult.left )
    }

    const certificatesMap = new Map<string, Certificate>(
      existResult.right.map( cert => [cert.id.toString(), cert] ) )

    const certificates: Certificate[] = []
    for ( const cert of certificatee ) {
      const existingCert = certificatesMap.get( cert.id.toString() )
      if ( existingCert ) {
        const updatedCert = Certificate.fromPrimitives(
          existingCert.id.toString(),
          workerId,
          cert.name,
          cert.url,
          cert.type,
          existingCert.createdAt.toString( )
        )

        if ( updatedCert instanceof Errors ) {
          return left( updatedCert.values )
        }
        certificates.push( updatedCert )
      }
      else {
        const newCert = Certificate.create(
          cert.id.toString(),
          workerId,
          cert.name,
          cert.url,
          cert.type
        )
        if ( newCert instanceof Errors ) {
          return left( newCert.values )
        }
        certificates.push( newCert )
      }
    }
    return right( certificates )
  }

  async execute( workerId: string,
    certificatee: CertificateDTO[] ): Promise<Either<BaseException[], Certificate[]>> {

    const wId = wrapType( () => UUID.from( workerId ) )

    if ( wId instanceof BaseException ) {
      return left( [wId] )
    }

    const updatedCertificates = await this.ensureCertificatesExist( workerId,
      certificatee )

    if ( isLeft( updatedCertificates ) ) {
      return left( updatedCertificates.left )
    }

    const certificates = updatedCertificates.right
    const upsertResult = await this.dao.upsert( wId, certificates )

    if ( isLeft( upsertResult ) ) {
      return left( [upsertResult.left] )
    }

    return right( certificates )
  }
}