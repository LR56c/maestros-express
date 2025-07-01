import {
  DomainException
} from "../../../shared/domain/exceptions/domain_exception"

export class InvalidUploadRequestTypeException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidUploadRequestTypeException"
  }
}
