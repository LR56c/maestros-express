import {
  DomainException
} from "../../../shared/domain/exceptions/domain_exception"

export class InvalidWorkerBookingStatusException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidWorkerBookingStatusException"
  }
}
