import {
  BaseException
}                 from "@/modules/shared/domain/exceptions/base_exception"
import { Errors } from "@/modules/shared/domain/exceptions/errors"
import {
  UnknownException
}                 from "@/modules/shared/domain/exceptions/unknown_exception"

export function wrapType<T, Err extends BaseException>( returnFunction: () => T ): T | BaseException {
  try {
    return returnFunction()
  }
  catch ( e: unknown ) {
    if ( e instanceof BaseException ) {
      return e
    }
    if ( e instanceof Error ) {
      return new UnknownException( e.message )
    }
    return new UnknownException()
  }
}

export async function wrapTypeAsync<T, Err extends Error>( returnFunction: () => Promise<T> ): Promise<T | BaseException> {
  try {
    return await returnFunction()
  }
  catch ( e: unknown ) {
    if ( e instanceof BaseException ) {
      return e
    }
    if ( e instanceof Error ) {
      return new UnknownException( e.message )
    }
    return new UnknownException()
  }
}

export function wrapTypeDefault<T, R>(
  defaultValue: T,
  returnFunction: ( value: R ) => T,
  updaterValue: R | null | undefined ): T | BaseException {
  if ( updaterValue === null || updaterValue === undefined ) {
    return defaultValue
  }
  else {
    return wrapType( () => returnFunction( updaterValue ) )
  }
}


export async function wrapTypeErrors<T, Err extends BaseException>( returnFunction: () => T ): Promise<T | Errors> {
  try {
    return await returnFunction()
  }
  catch ( e: unknown ) {
    if ( Array.isArray( e ) ) {
      const errors = e.filter(
        ( err ): err is BaseException => err instanceof BaseException )

      if ( errors.length > 0 ) {
        return new Errors( errors )
      }
    }
    else if ( e instanceof BaseException ) {
      return new Errors( [e] )
    }
    else if ( e instanceof Error ) {
      return new Errors( [new UnknownException( e.message )] )
    }

    return new Errors( [new UnknownException()] )
  }
}

/**
 * Handles different error types based on the error type.
 *
 * @template T The type of the return value of the function.
 * @template E The type of the error that extends BaseException.
 * @param {() => Promise<T>} fn The function to execute.
 * @param {(error: E) => T | void} [onError] The callback to handle errors. If it returns a value, the execution stops and returns that value.
 * @param {(...errors: BaseException[]) => Promise<T>} [finallyAfterErrors] The callback to execute after all errors have been handled, if no value was returned by onError.
 * @returns {Promise<T | undefined>} The result of the function or the result of the error handling.
 *
 * @example
 * class PostIsArchivedError extends BaseException {
 *
 *   constructor() {
 *     super();
 *     this.name = "PostIsArchivedError";
 *     this.message = "Post is archived";
 *   }
 * }
 *
 * class PostDoesNotExistError extends BaseException {
 *
 *   constructor(public readonly id: string) {
 *     super();
 *     this.name = "PostDoesNotExistError";
 *     this.message = `The post ${this.id} does not exist`;
 *   }
 * }
 *
 * type MyError = PostDoesNotExistError | PostIsArchivedError;
 *
 * const resultWithReturnAndExhaustive = await executeWithErrorHandling(
 *   async () => {
 *     // Simulate some async operation that may throw an error
 *     throw new PostDoesNotExistError("123");
 *     return 1;
 *   },
 *   (error: MyError) => {
 *     switch (error.name) {
 *       case "PostIsArchivedError":
 *         console.log("Handling PostIsArchivedError");
 *         return 10;
 *       case "PostDoesNotExistError":
 *         console.log(`Handling PostDoesNotExistError for post ${error.id}`);
 *         return 20;
 *       default:
 *         assertNever(error);
 *     }
 *   },
 * );
 *
 * const resultWithoutErrorReturnAndReturnWithFinally = await executeWithErrorHandling(
 *   async () => {
 *     // Simulate some async operation that may throw an error
 *     throw new PostDoesNotExistError("123");
 *     return 1;
 *   },
 *   (error: MyError) => {
 *     switch (error.type) {
 *       case "PostIsArchivedError":
 *         console.log("Handling PostIsArchivedError");
 *       case "PostDoesNotExistError":
 *         console.log(`Handling PostDoesNotExistError for post ${error.id}`);
 *     }
 *   },
 *   async (...errors) => {
 *     console.log("Handling errors in finallyAfterErrors", errors);
 *     return 30;
 *   }
 * );
 */
export async function executeWithErrorHandling<T, E extends BaseException>(
  fn: () => Promise<T>,
  onError: ( error: E ) => T | void = () => undefined,
  finallyAfterErrors?: ( ...errors: BaseException[] ) => Promise<T>
): Promise<T | undefined> {
  try {
    return await fn()
  }
  catch ( error: unknown ) {
    let errors: BaseException[] = []

    if ( Array.isArray( error ) ) {
      errors = error.filter(
        ( err ): err is BaseException => err instanceof BaseException
      )

      if ( errors.length > 0 ) {
        for ( const err of errors ) {
          const response = onError( err as E )
          if ( response ) {
            return response
          }
        }
      }
    }
    else if ( error instanceof BaseException ) {
      const response = onError( error as E )
      if ( response ) {
        return response
      }
    }
    else if ( error instanceof Error ) {
      const response = onError( new UnknownException( error.message ) as E )
      if ( response ) {
        return response
      }
    }
    else {
      const response = onError( new UnknownException() as E )
      if ( response ) {
        return response
      }
    }

    if ( finallyAfterErrors ) {
      return await finallyAfterErrors( ...errors )
    }
    return undefined
  }
}
