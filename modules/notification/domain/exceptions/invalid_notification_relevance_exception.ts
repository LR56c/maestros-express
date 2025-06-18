import {
  DomainException
} from "../../../shared/domain/exceptions/domain_exception"

export class InvalidNotificationRelevanceException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidNotificationRelevanceException"
  }
}
