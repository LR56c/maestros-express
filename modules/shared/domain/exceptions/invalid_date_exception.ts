import {
  DomainException
} from "@/modules/shared/domain/exceptions/domain_exception"

export class InvalidDateException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidDateException"
  }
}
