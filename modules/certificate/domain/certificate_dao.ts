import { Certificate } from "@/modules/certificate/domain/certificate"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import { Either }      from "fp-ts/Either"
import { UUID }        from "@/modules/shared/domain/value_objects/uuid"

export abstract class CertificateDAO {
  abstract add( certificate : Certificate ): Promise<Either<BaseException, boolean>>
  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>
  abstract getByWorker ( workerId: UUID ): Promise<Either<BaseException[], Certificate[]>>
  abstract getById ( id: UUID ): Promise<Either<BaseException[], Certificate>>
}
