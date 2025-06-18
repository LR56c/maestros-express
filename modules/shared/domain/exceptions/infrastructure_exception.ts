import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"

export class InfrastructureException extends BaseException {
  constructor( message?: string ) {
    super( message )
    this.name = "InfrastructureException"
  }
}
