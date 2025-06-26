import { CertificateDAO }              from "@/modules/certificate/domain/certificate_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ensureCertificateExist
}                                      from "@/modules/certificate/utils/ensure_certificate_exist"

export class RemoveCertificate {
  constructor(private readonly dao : CertificateDAO) {}

  async execute( id: string ): Promise<Either<BaseException[], boolean>>{
    const exist = await ensureCertificateExist(this.dao, id)
    if ( isLeft(exist) ) {
      return left(exist.left)
    }

    const result = await this.dao.remove(exist.right.id)
    if ( isLeft(result) ) {
      return left([result.left])
    }

    return right(true)
  }

}