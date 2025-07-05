import { Either, left, right } from "fp-ts/Either"
import {
  InfrastructureException
}                              from "@/modules/shared/domain/exceptions/infrastructure_exception"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  Email
}                              from "@/modules/shared/domain/value_objects/email"
import {
  ValidString
}                              from "@/modules/shared/domain/value_objects/valid_string"
import {
  Errors
}                              from "@/modules/shared/domain/exceptions/errors"
import {
  DataNotFoundException
}                              from "@/modules/shared/domain/exceptions/data_not_found_exception"
import { AuthRepository }      from "@/modules/user/domain/auth_repository"
import { UserAnon, UserAuth }  from "@/modules/user/domain/user"
import { Password }            from "@/modules/user/domain/password"
import { auth }                from "@/lib/auth"
import { headers }             from "next/headers"
import { PrismaClient }        from "@/lib/generated/prisma"

export class BetterAuthWithPrismaNextjsUserData implements AuthRepository {
  constructor( private readonly db: PrismaClient ) {
  }

  async getByEmail( email: Email ): Promise<Either<BaseException[], UserAuth>> {
    try {
      const result = await this.db.user.findUnique( {
        where: {
          email: email.value
        }
      } )

      if ( !result ) {
        return left( [new DataNotFoundException()] )
      }

      const user = UserAuth.fromPrimitives(
        result.id,
        result.email,
        result.name,
        result.createdAt,
        result.role!,
        result.image
      )

      if ( user instanceof Errors ) {
        return left( user.values )
      }

      return right( user )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )

    }
  }

  private async getUser(): Promise<Either<BaseException[], UserAuth>> {
    const session = await auth.api.getSession( { headers: await headers() } )

    if ( !session ) {
      return left( [new InfrastructureException()] )
    }

    const {
            id,
            email,
            name,
            image,
            createdAt,
            role
          } = session.user

    const user = UserAuth.fromPrimitives( id, email, name, createdAt,
      role!, image ? image : null )

    if ( user instanceof Errors ) {
      return left( user.values )
    }

    return right( user )
  }

  async login( email: Email,
    password: Password ): Promise<Either<BaseException[], UserAuth>> {
    try {
      await auth.api.signInEmail( {
        body: {
          email   : email.value,
          password: password.value
        }
      } )
      return this.getUser()
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async logout( token?: ValidString ): Promise<Either<BaseException, boolean>> {
    // @ts-ignore
    const { success } = await auth.api.signOut( await headers() )
    if ( !success ) {
      return left( new InfrastructureException() )
    }
    return right( true )
  }

  async register( user: UserAuth,
    password: Password ): Promise<Either<BaseException[], UserAuth>> {
    try {
      const result = await auth.api.signUpEmail( {
        body: {
          email   : user.email.value,
          password: password.value,
          name    : user.fullName.value
        }
      } )

      if ( user.avatar ) {
        await this.db.user.update( {
          where: {
            id: result.user.id
          },
          data : {
            image: user.avatar.value
          }
        } )
      }
      return this.getUser()
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }

  }

  async remove( id: ValidString ): Promise<Either<BaseException, boolean>> {
    const { success } = await auth.api.removeUser( {
      body: {
        userId: id.value
      }
    } )
    if ( !success ) {
      return left( new InfrastructureException() )
    }
    return right( true )
  }

  async update( data: UserAuth ): Promise<Either<BaseException[], boolean>> {
    try {
      await this.db.user.update( {
        where: {
          id: data.userId.value
        },
        data : {
          image: data.avatar?.value ?? null,
          role : data.role.toString()
                     .toLowerCase() as "admin" | "client" | "worker"
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async anonymous(): Promise<Either<BaseException[], UserAuth>> {
    try {
      const result = await auth.api.signInAnonymous()

      if ( !result ) {
        return left( [new InfrastructureException()] )
      }

      const { id, email, name, createdAt } = result.user

      const emailStart = email.split( "@" )[0]
      const user       = UserAnon.fromPrimitives( id,
        `${ emailStart }@express.com`, name, createdAt )

      if ( user instanceof Errors ) {
        return left( user.values )
      }

      return right( user )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }
}