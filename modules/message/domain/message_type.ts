import { z } from "zod"
import {
  InvalidMessageTypeException
} from "@/modules/message/domain/exception/invalid_message_type_exception"

export enum MessageTypeEnum {
  SUBJECT = "SUBJECT",
  IMAGE = "IMAGE",
  TEXT = "TEXT",
  QUOTATION = "QUOTATION",
}

export class MessageType {

  readonly value: MessageTypeEnum

  private constructor( value: MessageTypeEnum ) {
    this.value = value
  }

  static create( value: MessageTypeEnum ): MessageType {
    return new MessageType( value )
  }

  static from( value: string ): MessageType {
    const result = z.nativeEnum( MessageTypeEnum )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidMessageTypeException()
    }
    return new MessageType( result.data )
  }

  static fromOrNull( value: string ): MessageType | undefined {
    try {
      return MessageType.from( value )
    }
    catch {
      return undefined
    }
  }
}
