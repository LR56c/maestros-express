import {
  DomainException
} from "../../../shared/domain/exceptions/domain_exception"

export class InvalidPaymentStatusException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidPaymentStatusException"
  }
}
