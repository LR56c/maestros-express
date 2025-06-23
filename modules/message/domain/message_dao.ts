import type { Either } from "fp-ts/Either"
import {
  BaseException
}                      from "@/modules/shared/domain/exceptions/base_exception"
import { UUID }        from "@/modules/shared/domain/value_objects/uuid"
import { Message }     from "@/modules/message/domain/message"

export abstract class MessageDAO {
  abstract add( message : Message ): Promise<Either<BaseException, boolean>>
  abstract update( message : Message ): Promise<Either<BaseException, boolean>>
  abstract getByUser( userId: UUID ): Promise<Either<BaseException[], Message[]>>
  abstract getById( id: UUID ): Promise<Either<BaseException[], Message>>
}
