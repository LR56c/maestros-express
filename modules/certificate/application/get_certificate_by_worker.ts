import { CertificateDAO } from "@/modules/certificate/domain/certificate_dao"
import { UUID }           from "@/modules/shared/domain/value_objects/uuid"
import { Either, left }   from "fp-ts/Either"
import {
  BaseException
}                         from "@/modules/shared/domain/exceptions/base_exception"
import { Certificate }    from "@/modules/certificate/domain/certificate"
import { wrapType }       from "@/modules/shared/utils/wrap_type"

export class GetCertificateByWorker {
  constructor(private readonly dao : CertificateDAO) {}

  async execute ( workerId:string ): Promise<Either<BaseException[], Certificate[]>>{

    const vid = wrapType(()=>UUID.from(workerId))

    if (vid instanceof BaseException) {
      return left([vid])
    }

    return await this.dao.getByWorker(vid as UUID)
  }
}