import {
  BaseException
} from "@/modules/shared/domain/exceptions/base_exception"

export const containError = ( originalErrors : BaseException[],errorToCheck : BaseException ): boolean => {
  return originalErrors.some( ( error ) => {
    return error.name === errorToCheck.name
  } )
}