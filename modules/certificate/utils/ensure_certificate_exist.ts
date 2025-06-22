import { CertificateDAO } from "@/modules/certificate/domain/certificate_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import { Certificate } from "@/modules/certificate/domain/certificate"
import { wrapType } from "@/modules/shared/utils/wrap_type"
import { UUID } from "@/modules/shared/domain/value_objects/uuid"
import {
  DataNotFoundException
} from "@/modules/shared/domain/exceptions/data_not_found_exception"

export const ensureCertificateExist = async ( dao: CertificateDAO, certificateId: string ): Promise<Either<BaseException[], Certificate>> =>{
  const vid = wrapType(()=>UUID.from(certificateId))

  if (vid instanceof BaseException) {
    return left([vid])
  }
  const certificate = await dao.getById(vid as UUID)

  if (isLeft(certificate)) {
    return left(certificate.left)
  }

  if(certificate.right.id.toString() !== certificateId) {
    return left( [new DataNotFoundException()] )
  }

  return right(certificate.right)
}