import { z } from "zod"
import {
  InvalidPackageDocumentTypeException
}            from "@/modules/package/modules/package_document/domain/exception/invalid_package_document_type_exception"

export enum PackageDocumentTypeEnum {
  PDF   = "PDF",
  IMAGE = "IMAGE",
  FILE  = "FILE",
  VIDEO = "VIDEO",
}

export class PackageDocumentType {

  readonly value: PackageDocumentTypeEnum

  private constructor( value: PackageDocumentTypeEnum ) {
    this.value = value
  }

  static create( value: PackageDocumentTypeEnum ): PackageDocumentType {
    return new PackageDocumentType( value )
  }

  static from( value: string ): PackageDocumentType {
    const result = z.nativeEnum( PackageDocumentTypeEnum )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidPackageDocumentTypeException()
    }
    return new PackageDocumentType( result.data )
  }

  static fromOrNull( value: string ): PackageDocumentType | undefined {
    try {
      return PackageDocumentType.from( value )
    }
    catch {
      return undefined
    }
  }
}
