import { z } from "zod"
import {
  InvalidResetPasswordMethodException
}            from "./exceptions/invalid_reset_password_method_exception"

export enum ResetPasswordTypeEnum {
  PHONE = "PHONE",
  EMAIL = "EMAIL",
}

export class ResetPassword {

  readonly value: ResetPasswordTypeEnum

  private constructor( value: ResetPasswordTypeEnum ) {
    this.value = value
  }

  static create( value: ResetPasswordTypeEnum ): ResetPassword {
    return new ResetPassword( value )
  }

  static from( value: string ): ResetPassword {
    const result = z.nativeEnum( ResetPasswordTypeEnum )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidResetPasswordMethodException()
    }
    return new ResetPassword( result.data )
  }

  static fromOrNull( value: string ): ResetPassword | undefined {
    try {
      return ResetPassword.from( value )
    }
    catch {
      return undefined
    }
  }
}
