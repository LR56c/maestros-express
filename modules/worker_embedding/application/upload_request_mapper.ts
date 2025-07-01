import { UploadRequest }             from "@/modules/worker_embedding/domain/upload_request"
import {
  UploadRequestDTO
}                                    from "@/modules/worker_embedding/application/upload_request_dto"
import {
  Errors
}                                    from "@/modules/shared/domain/exceptions/errors"
import { wrapType, wrapTypeDefault } from "@/modules/shared/utils/wrap_type"
import {
  ValidString
}                                    from "@/modules/shared/domain/value_objects/valid_string"
import {
  BaseException
}                                    from "@/modules/shared/domain/exceptions/base_exception"
import {
  UploadRequestType
}                                    from "@/modules/worker_embedding/domain/upload_request_type"

export class UploadRequestMapper {
  static toDTO( upload: UploadRequest ): UploadRequestDTO {
    return {
      process_input: upload.processInput?.value ?? "",
      status       : upload.status.value,
      info_text    : upload.infoText?.value ?? ""
    }
  }

  static toJSON( upload: UploadRequest ): Record<string, any> {
    return {
      process_input: upload.processInput,
      status       : upload.status,
      info_text    : upload.infoText
    }
  }

  static fromJSON( upload: Record<string, any> ): UploadRequestDTO | Errors {
    const errors = []

    const processInput = wrapTypeDefault( undefined,
      ( value ) => ValidString.from( value ), upload.process_input )

    if ( processInput instanceof BaseException ) {
      errors.push( processInput )
    }

    const infoText = wrapTypeDefault( undefined,
      ( value ) => ValidString.from( value ), upload.info_text )

    if ( infoText instanceof BaseException ) {
      errors.push( infoText )
    }

    const status = wrapType( () => UploadRequestType.from( upload.status ) )

    if ( status instanceof BaseException ) {
      errors.push( status )
    }

    if ( errors.length > 0 ) {
      return new Errors( errors )
    }

    return {
      process_input: processInput instanceof ValidString ? processInput.value : "",
      status       : ( status as UploadRequestType ).value,
      info_text    : infoText instanceof ValidString ? infoText.value : ""
    }
  }

  static toDomain(json: Record<string, any>) : UploadRequest | Errors {
    return UploadRequest.fromPrimitives(
      json.status,
      json.info_text,
      json.process_input,
    )
  }
}