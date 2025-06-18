import { BaseException } from "../../../shared/domain/exceptions/base_exception"


export abstract class InvalidPasswordException extends BaseException {
  constructor( message?: string ) {
    super( message )
    this.name = "InvalidPasswordException"
  }
}

export class PasswordInsufficientLowercaseException
  extends InvalidPasswordException {
  constructor( message?: string ) {
    super( message )
    this.name = "PasswordInsufficientLowercaseException"
  }
}

export class PasswordInsufficientUppercaseException
  extends InvalidPasswordException {
  constructor( message?: string ) {
    super( message )
    this.name = "PasswordInsufficientUppercaseException"
  }
}

export class PasswordInsufficientNumberException
  extends InvalidPasswordException {
  constructor( message?: string ) {
    super( message )
    this.name = "PasswordInsufficientUppercaseException"
  }
}

export class PasswordInsufficientCharacterException
  extends InvalidPasswordException {
  constructor( message?: string ) {
    super( message )
    this.name = "PasswordInsufficientCharacterException"
  }
}

export class PasswordInsufficientLengthException
  extends InvalidPasswordException {
  constructor( message?: string ) {
    super( message )
    this.name = "PasswordInsufficientCharacterException"
  }
}
