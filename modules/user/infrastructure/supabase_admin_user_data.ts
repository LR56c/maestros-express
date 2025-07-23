import { SupabaseClient }      from "@supabase/supabase-js"
import { Either, left, right } from "fp-ts/Either"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import {
  ValidString
}                              from "@/modules/shared/domain/value_objects/valid_string"
import {
  Email
}                              from "@/modules/shared/domain/value_objects/email"
import { Password }            from "@/modules/user/domain/password"
import { User, UserAuth }      from "@/modules/user/domain/user"
import { AuthRepository }      from "@/modules/user/domain/auth_repository"
import {
  Errors
}                              from "@/modules/shared/domain/exceptions/errors"
import {
  ValidInteger
}                              from "@/modules/shared/domain/value_objects/valid_integer"
import { PaginatedResult }     from "@/modules/shared/domain/paginated_result"


export class SupabaseAdminUserData implements AuthRepository {
  constructor( private readonly client: SupabaseClient ) {
  }

  async remove( id: ValidString ): Promise<Either<BaseException, boolean>> {
    const { data, error } = await this.client.auth.admin.deleteUser( id.value )
    if ( error ) {
      return left( new InfrastructureException( error.message ) )
    }
    return right( true )
  }

  async getByUsername( username: ValidString ): Promise<Either<BaseException[], User>> {
    const { data, error } = await this.client.rpc( "get_by_username", {
      p_username: username.value
    } ).single()
    if ( error ) {
      return left( [new InfrastructureException( error.message )] )
    }
    const d        = data as any
    const metadata = d.raw_user_meta_data

    const user = UserAuth.fromPrimitives(
      d.id,
      d.email,
      metadata.username,
      metadata.name,
      d.created_at,
      metadata.role,
      metadata.status,
      metadata.avatar
    )
    if ( user instanceof Errors ) {
      return left( user.values )
    }
    return right( user )
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<User>>> {
    console.log( "search", query, limit, skip, sortBy, sortType )
    const { data, error } = await this.client.rpc(
      "search_users_by_json_paginated", {
        p_filters  : query,
        p_limit    : limit?.value,
        p_offset   : skip?.value,
        p_order_by : sortBy?.value,
        p_order_dir: sortType?.value
      } )
    console.log( "data", data, error )
    if ( error ) {
      return left( [new InfrastructureException( error.message )] )
    }
    return left( [new InfrastructureException()] )
    // const d        = data as any
    // const metadata = d.raw_user_meta_data
    //
    // const user = UserAuth.fromPrimitives(
    //   d.id,
    //   d.email,
    //   metadata.username,
    //   metadata.name,
    //   d.created_at,
    //   metadata.role,
    //   metadata.status,
    //   metadata.avatar
    // )
    // if ( user instanceof Errors ) {
    //   return left( user.values )
    // }
    // return right( user )
  }


  async register( auth: User,
    password: Password ): Promise<Either<BaseException[], User>> {
    const { data, error } = await this.client.auth.admin.createUser( {
      email        : auth.email.value,
      password     : password.value,
      email_confirm: true,
      user_metadata: {
        name  : auth.fullName.value,
        avatar: auth.avatar?.value,
        role  : auth.role.toString(),
        status: auth.status.value
      }
    } )
    if ( error ) {
      return left( [new InfrastructureException( error.message )] )
    }
    const metadata = data.user!.user_metadata

    const user = UserAuth.fromPrimitives(
      data.user!.id,
      data.user!.email!,
      metadata.username,
      metadata.name,
      data.user!.created_at,
      metadata.role,
      metadata.status,
      metadata.avatar
    )
    if ( user instanceof Errors ) {
      return left( user.values )
    }
    return right( user )
  }

  async update( auth: User ): Promise<Either<BaseException[], boolean>> {
    const { data, error } = await this.client.auth.admin.updateUserById(
      auth.userId.toString(), {
        user_metadata: {
          status: auth.status.value,
          avatar: auth.avatar?.value,
          name  : auth.fullName.value,
          role  : auth.role.toString()
        }
      } )
    if ( error ) {
      return left( [new InfrastructureException( error.message )] )
    }
    return right( true )
  }

  async getByEmail( email: Email ): Promise<Either<BaseException[], User>> {
    const { data, error } = await this.client.rpc( "get_user_id_by_email", {
      p_email: email.value
    } ).single()
    if ( error ) {
      return left( [new InfrastructureException( error.message )] )
    }
    const d        = data as any
    const metadata = d.raw_user_meta_data

    const user = UserAuth.fromPrimitives(
      d.id,
      d.email,
      metadata.username,
      metadata.name,
      d.created_at,
      metadata.role,
      metadata.status,
      metadata.avatar
    )
    if ( user instanceof Errors ) {
      return left( user.values )
    }
    return right( user )
  }
}