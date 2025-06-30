import {
  DomainException
} from "@/modules/shared/domain/exceptions/domain_exception"

export class InvalidImageException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidImageException"
  }
}
