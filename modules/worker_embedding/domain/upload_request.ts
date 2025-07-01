import { ValidString } from "@/modules/shared/domain/value_objects/valid_string"
import {
  UploadRequestType
} from "@/modules/worker_embedding/domain/upload_request_type"
import { Errors }                    from "@/modules/shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault } from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"

export class UploadRequest {
  constructor(
    readonly status: UploadRequestType,
    readonly infoText?: ValidString,
    readonly processInput?: ValidString,
  ) {}

  static create(
    status: string,
    infoText?: string,
    processInput?: string,
  ): UploadRequest | Errors {
    return UploadRequest.fromPrimitives(
      status,
      infoText,
      processInput,
    )
  }

  static fromPrimitivesThrow(
    status: string,
    infoText?: string,
    processInput?: string,
  ): UploadRequest {
    return new UploadRequest(
      UploadRequestType.from(status),
      infoText ? ValidString.from(infoText) : undefined,
      processInput ? ValidString.from(processInput) : undefined,
    )
  }

  static fromPrimitives(
    status: string,
    infoText?: string,
    processInput?: string,
  ): UploadRequest  | Errors{
    const errors = []
    const type = wrapType(()=> UploadRequestType.from(status))

    if (type instanceof BaseException) {
      errors.push(type)
    }

    const info = wrapTypeDefault(undefined, (value) => ValidString.from(value),infoText)

    if (info instanceof BaseException) {
      errors.push(info)
    }

    const process = wrapTypeDefault(undefined, (value) => ValidString.from(value),processInput)

    if (process instanceof BaseException) {
      errors.push(process)
    }

    if (errors.length > 0) {
      return new Errors(errors)
    }

    return new UploadRequest(
      type as UploadRequestType,
      info as ValidString | undefined,
      process as ValidString | undefined,
    )
  }
}