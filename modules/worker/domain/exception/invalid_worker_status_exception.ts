import {
  DomainException
} from "../../../shared/domain/exceptions/domain_exception"

export class InvalidWorkerStatusException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidWorkerStatusException"
  }
}
