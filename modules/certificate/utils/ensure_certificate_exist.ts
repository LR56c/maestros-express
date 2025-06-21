import { CertificateDAO } from "@/modules/certificate/domain/certificate_dao"
import { Either, left }   from "fp-ts/Either"
import {
  BaseException
}                         from "@/modules/shared/domain/exceptions/base_exception"
import { Certificate }    from "@/modules/certificate/domain/certificate"
import { wrapType }       from "@/modules/shared/utils/wrap_type"
import { UUID }           from "@/modules/shared/domain/value_objects/uuid"

export const ensureCertificateExist = async ( dao: CertificateDAO, certificateId: string ): Promise<Either<BaseException[], Certificate>> =>{
  const vid = wrapType(()=>UUID.from(certificateId))

  if (vid instanceof BaseException) {
    return left([vid])
  }
  return await dao.getById(vid as UUID)
}