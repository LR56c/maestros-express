import { CertificateDAO } from "@/modules/certificate/domain/certificate_dao"
import { Certificate }                 from "@/modules/certificate/domain/certificate"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  CertificateDTO
}                         from "@/modules/certificate/application/certificate_dto"
import {
  ensureCertificateExist
}                         from "@/modules/certificate/utils/ensure_certificate_exist"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import {
  containError
}                                      from "@/modules/shared/utils/contain_error"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"

export class AddCertificate {
  constructor(private readonly dao : CertificateDAO) {}

  async execute( dto : CertificateDTO ): Promise<Either<BaseException[], boolean>>{
    const exist = await ensureCertificateExist(this.dao, dto.id)

    if ( isLeft( exist ) ) {
      if ( !containError( exist.left, new DataNotFoundException() ) ) {
        return left( exist.left )
      }
    }

    const certificate = Certificate.create(
      dto.id,
      dto.worker_id,
      dto.name,
      dto.url,
      dto.type,
    )

    if ( certificate instanceof Errors ) {
      return left(certificate.values)
    }

    const result = await this.dao.add(certificate)

    if ( isLeft(result) ) {
      return left([result.left])
    }

    return right(true)
  }

}