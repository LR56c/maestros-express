import {
  DomainException
} from "../../../shared/domain/exceptions/domain_exception"

export class InvalidWorkerScheduleStatusException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidWorkerScheduleStatusException"
  }
}
