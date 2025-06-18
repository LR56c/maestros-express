import {
  DomainException
} from "../../../shared/domain/exceptions/domain_exception"

export class InvalidNotificationSourceTypeException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidNotificationSourceTypeException"
  }
}
