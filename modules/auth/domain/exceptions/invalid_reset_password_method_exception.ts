import {
  DomainException
} from "../../../shared/domain/exceptions/domain_exception"

export class InvalidResetPasswordMethodException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidResetPasswordMethodException"
  }
}
