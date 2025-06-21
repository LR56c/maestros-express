import {
  DomainException
} from "../../../shared/domain/exceptions/domain_exception"

export class InvalidReviewTypeException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidReviewTypeException"
  }
}
