import { z } from "zod"
import {
  InvalidMessageStatusException
} from "@/modules/message/domain/exception/invalid_message_status_exception"

export enum MessageStatusEnum {
  SENDING = "SENDING",
  SENT = "SENT",
  READ = "READ",
  CANCELED = "CANCELED",
  ACCEPTED = "ACCEPTED",
}

export class MessageStatus {

  readonly value: MessageStatusEnum

  private constructor( value: MessageStatusEnum ) {
    this.value = value
  }

  static create( value: MessageStatusEnum ): MessageStatus {
    return new MessageStatus( value )
  }

  static from( value: string ): MessageStatus {
    const result = z.nativeEnum( MessageStatusEnum )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidMessageStatusException()
    }
    return new MessageStatus( result.data )
  }

  static fromOrNull( value: string ): MessageStatus | undefined {
    try {
      return MessageStatus.from( value )
    }
    catch {
      return undefined
    }
  }
}
