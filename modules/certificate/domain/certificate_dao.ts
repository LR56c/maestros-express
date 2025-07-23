import { Certificate } from "@/modules/certificate/domain/certificate"
import {
  BaseException
}                      from "@/modules/shared/domain/exceptions/base_exception"
import { Either }      from "fp-ts/Either"
import { UUID }        from "@/modules/shared/domain/value_objects/uuid"

export abstract class CertificateDAO {
  abstract upsert( workerId: UUID, certificatee : Certificate[] ): Promise<Either<BaseException, boolean>>
  abstract getByWorker ( workerId: UUID ): Promise<Either<BaseException[], Certificate[]>>
}
