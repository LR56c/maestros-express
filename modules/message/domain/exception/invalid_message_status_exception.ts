import {
  DomainException
} from "../../../shared/domain/exceptions/domain_exception"

export class InvalidMessageStatusException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidMessageStatusException"
  }
}
