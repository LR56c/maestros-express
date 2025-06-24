import {
  DomainException
} from "@/modules/shared/domain/exceptions/domain_exception"

export class InvalidPackageDocumentTypeException extends DomainException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidPackageDocumentTypeException"
  }
}
