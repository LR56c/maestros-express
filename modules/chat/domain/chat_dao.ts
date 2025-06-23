import { Chat } from "@/modules/chat/domain/chat"
import { Either } from "fp-ts/Either"
import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"
import { UUID } from "@/modules/shared/domain/value_objects/uuid"

export abstract class ChatDAO {
  abstract add( chat : Chat ): Promise<Either<BaseException, boolean>>
  abstract update( chat : Chat ): Promise<Either<BaseException, boolean>>
  abstract getByUser( userId : UUID ): Promise<Either<BaseException[], Chat[]>>
  abstract getById( id : UUID ): Promise<Either<BaseException[], Chat>>
}