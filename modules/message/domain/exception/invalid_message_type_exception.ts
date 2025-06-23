import {
  DomainException
} from "../../../shared/domain/exceptions/domain_exception"

export class InvalidMessageTypeException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidMessageTypeException"
  }
}
