import { z } from "zod"
import {
  InvalidAuthMethodException
}            from "@/modules/user/domain/exception/invalid_auth_method_exception"

export enum AuthMethodTypeEnum {
  EMAIL  = "EMAIL",
  GOOGLE = "GOOGLE",
}

export class AuthMethod {

  readonly value: AuthMethodTypeEnum

  private constructor( value: AuthMethodTypeEnum ) {
    this.value = value
  }

  static create( value: AuthMethodTypeEnum ): AuthMethod {
    return new AuthMethod( value )
  }

  static from( value: string ): AuthMethod {
    const result = z.nativeEnum( AuthMethodTypeEnum )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidAuthMethodException()
    }
    return new AuthMethod( result.data )
  }

  static fromOrNull( value: string ): AuthMethod | undefined {
    try {
      return AuthMethod.from( value )
    }
    catch {
      return undefined
    }
  }
}
