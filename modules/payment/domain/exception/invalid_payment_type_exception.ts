import {
  DomainException
} from "../../../shared/domain/exceptions/domain_exception"

export class InvalidPaymentTypeException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidPaymentTypeException"
  }
}
