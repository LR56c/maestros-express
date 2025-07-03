import {
  DomainException
} from "../../../shared/domain/exceptions/domain_exception"

export class InvalidAuthMethodException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidAuthMethodException"
  }
}
