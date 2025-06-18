import { z } from "zod"
import {
  InvalidNotificationSourceTypeException
}            from "./exceptions/invalid_notification_source_type_exception"

export enum NotificationSourceTypeEnum {
  FIREBASE = "FIREBASE"
}

export class NotificationSourceType {

  readonly value: NotificationSourceTypeEnum

  private constructor( value: NotificationSourceTypeEnum ) {
    this.value = value
  }

  static create( value: NotificationSourceTypeEnum ): NotificationSourceType {
    return new NotificationSourceType( value )
  }

  static from( value: string ): NotificationSourceType {
    const result = z.nativeEnum( NotificationSourceTypeEnum )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidNotificationSourceTypeException()
    }
    return new NotificationSourceType( result.data )
  }

  static fromOrNull( value: string ): NotificationSourceType | undefined {
    try {
      return NotificationSourceType.from( value )
    }
    catch {
      return undefined
    }
  }
}
