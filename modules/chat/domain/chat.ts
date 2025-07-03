import { UUID }                      from "@/modules/shared/domain/value_objects/uuid"
import {
  ValidDate
}                                    from "@/modules/shared/domain/value_objects/valid_date"
import {
  ValidString
}                                    from "@/modules/shared/domain/value_objects/valid_string"
import { wrapType, wrapTypeDefault } from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import {
  Errors
}                                    from "@/modules/shared/domain/exceptions/errors"
import { Message }                   from "@/modules/message/domain/message"
import { User }                      from "@/modules/user/domain/user"

export class Chat {
  private constructor(
    readonly id: UUID,
    readonly worker: User,
    readonly client: User,
    readonly createdAt: ValidDate,
    readonly subject: ValidString,
    readonly messages: Message[],
    readonly acceptedDate?: ValidDate,
    readonly quotationAccepted?: UUID,
    readonly workerArchived?: ValidDate
  )
  {
  }

  static create(
    id: string,
    worker: User,
    client: User,
    subject: string,
    messages: Message[]
  ): Chat | Errors {
    return Chat.fromPrimitives(
      id,
      worker,
      client,
      new Date(),
      subject,
      messages,
      undefined,
      undefined,
      undefined
    )
  }

  static fromPrimitivesThrow(
    id: string,
    worker: User,
    client: User,
    createdAt: Date | string,
    subject: string,
    messages: Message[],
    acceptedDate?: Date | string,
    quotationAccepted?: string,
    workerArchived?: Date | string
  ): Chat {
    return new Chat(
      UUID.from( id ),
      worker,
      client,
      ValidDate.from( createdAt ),
      ValidString.from( subject ),
      messages,
      acceptedDate ? ValidDate.from( acceptedDate ) : undefined,
      quotationAccepted ? UUID.from( quotationAccepted ) : undefined,
      workerArchived ? ValidDate.from( workerArchived ) : undefined
    )
  }

  static fromPrimitives(
    id: string,
    worker: User,
    client: User,
    createdAt: Date | string,
    subject: string,
    messages: Message[],
    acceptedDate?: Date | string,
    quotationAccepted?: string,
    workerArchived?: Date | string
  ): Chat | Errors {
    const errors = []

    const idVO = wrapType(
      () => UUID.from( id ) )

    if ( idVO instanceof BaseException ) {
      errors.push( idVO )
    }

    const subjectVO = wrapType( () => ValidString.from( subject ) )

    if ( subjectVO instanceof BaseException ) {
      errors.push( subjectVO )
    }

    const createdAtVO = wrapType( () => ValidDate.from( createdAt ) )

    if ( createdAtVO instanceof BaseException ) {
      errors.push( createdAtVO )
    }

    const acceptedDateVO = wrapTypeDefault( undefined,
      ( value ) => ValidDate.from( value ), acceptedDate )

    if ( acceptedDateVO instanceof BaseException ) {
      errors.push( acceptedDateVO )
    }

    const quotationAcceptedVO = wrapTypeDefault( undefined,
      ( value ) => UUID.from( value ), quotationAccepted )

    if ( quotationAcceptedVO instanceof BaseException ) {
      errors.push( quotationAcceptedVO )
    }

    const workerArchivedVO = wrapTypeDefault( undefined,
      ( value ) => ValidDate.from( value ), workerArchived )

    if ( workerArchivedVO instanceof BaseException ) {
      errors.push( workerArchivedVO )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return new Chat(
      idVO as UUID,
      worker, client,
      createdAtVO as ValidDate,
      subjectVO as ValidString,
      messages,
      acceptedDateVO as ValidDate | undefined,
      quotationAcceptedVO as UUID | undefined,
      workerArchivedVO as ValidDate | undefined
    )
  }
}