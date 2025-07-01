import { z } from "zod"
import {
  InvalidUploadRequestTypeException
} from "@/modules/worker_embedding/domain/exception/invalid_upload_request_type_exception"

export enum UploadRequestTypeEnum {
  VALID      = "VALID",
  NO_RELATED = "NO_RELATED",
  ERROR      = "ERROR",
}

export class UploadRequestType {

  readonly value: UploadRequestTypeEnum

  private constructor( value: UploadRequestTypeEnum ) {
    this.value = value
  }

  static create( value: UploadRequestTypeEnum ): UploadRequestType {
    return new UploadRequestType( value )
  }

  static from( value: string ): UploadRequestType {
    const result = z.nativeEnum( UploadRequestTypeEnum )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidUploadRequestTypeException()
    }
    return new UploadRequestType( result.data )
  }

  static fromOrNull( value: string ): UploadRequestType | undefined {
    try {
      return UploadRequestType.from( value )
    }
    catch {
      return undefined
    }
  }
}
