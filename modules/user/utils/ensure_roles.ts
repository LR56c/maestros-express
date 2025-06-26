import type { Either }         from "fp-ts/Either"
import { isLeft, left, right } from "fp-ts/Either"
import { Role }                from "@/modules/role/domain/role"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import { SearchRole }          from "@/modules/role/application/search_role"

export const ensureRoles = async ( searchRole: SearchRole,
  names: string[] ): Promise<Either<BaseException[], Role[]>> => {
  const rolesResult = await searchRole.execute( {} )

  if ( isLeft( rolesResult ) ) {
    return left( rolesResult.left )
  }

  const namesMap   = new Map<string, string>(
    names.map( ( name ) => [name, name] ) )
  const rolesMap   = new Map<string, Role>(
    rolesResult.right.map( ( role ) => [role.name.value, role] ) )
  const existRoles = new Map<string, Role>()
  for ( const [name, role] of rolesMap ) {
    if ( namesMap.has( name ) ) {
      existRoles.set( name, role )
      namesMap.delete( name )
    }
  }

  if ( !existRoles.get( "user" ) ) {
    const userRole = rolesMap.get( "user" )
    existRoles.set( "user", userRole! )
  }

  return right( Array.from( existRoles.values() ) )
}
