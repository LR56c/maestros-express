import { z } from "zod"
import {
  InvalidCertificateTypeException
}            from "@/modules/certificate/domain/exception/invalid_certificate_type_exception"

export enum CertificateTypeEnum {
  PDF = "PDF",
  IMAGE = "IMAGE"
}

export class CertificateType {

  readonly value: CertificateTypeEnum

  private constructor( value: CertificateTypeEnum ) {
    this.value = value
  }

  static create( value: CertificateTypeEnum ): CertificateType {
    return new CertificateType( value )
  }

  static from( value: string ): CertificateType {
    const result = z.nativeEnum( CertificateTypeEnum )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidCertificateTypeException()
    }
    return new CertificateType( result.data )
  }

  static fromOrNull( value: string ): CertificateType | undefined {
    try {
      return CertificateType.from( value )
    }
    catch {
      return undefined
    }
  }
}
