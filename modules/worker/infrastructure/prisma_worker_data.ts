import { PrismaClient }                from "@/lib/generated/prisma"
import { WorkerDAO }                   from "@/modules/worker/domain/worker_dao"
import { Either, isLeft, left, right } from "fp-ts/Either"
import {
  BaseException
}                                      from "@/modules/shared/domain/exceptions/base_exception"
import {
  ValidString
}                                      from "@/modules/shared/domain/value_objects/valid_string"
import {
  ValidInteger
}                                      from "@/modules/shared/domain/value_objects/valid_integer"
import * as changeCase                 from "change-case"
import {
  InfrastructureException
}                                      from "@/modules/shared/domain/exceptions/infrastructure_exception"
import { Worker }                      from "@/modules/worker/domain/worker"
import {
  Errors
}                                      from "@/modules/shared/domain/exceptions/errors"
import { UserAuth }                    from "@/modules/user/domain/user"
import {
  Speciality
}                                      from "@/modules/speciality/domain/speciality"
import {
  WorkerTax
}                                      from "@/modules/worker_tax/domain/worker_tax"
import {
  UUID
}                                      from "@/modules/shared/domain/value_objects/uuid"
import {
  DataNotFoundException
}                                      from "@/modules/shared/domain/exceptions/data_not_found_exception"
import {
  PaginatedResult
}                                      from "@/modules/shared/domain/paginated_result"

type WorkerRelations = {
  user: UserAuth,
  // nationalIdentity: NationalIdentityFormat,
  specialities: Speciality[],
  taxes: WorkerTax[],
  // workZones: Zone[],
  // certificates: Certificate[],
  // stories: Story[],
  // bookings: WorkerBooking[],
  // schedule: WorkerSchedule[],
  // packages: Package[],
  // reviews: Review[],
}

export const mapWorkerRelations = async ( w: any ): Promise<Either<BaseException[], WorkerRelations>> => {
  const taxes: WorkerTax[] = []
  for ( const tax of w.WorkerTax ) {
    const taxMapped = WorkerTax.fromPrimitives(
      tax.id.toString(),
      tax.workerId.toString(),
      tax.name,
      tax.value,
      tax.valueFormat,
      tax.createdAt
    )
    if ( taxMapped instanceof Errors ) {
      return left( taxMapped.values )
    }
    taxes.push( taxMapped )
  }
  const specialities: Speciality[] = []
  for ( const ws of w.WorkerSpeciality ) {
    const spec = Speciality.fromPrimitives(
      ws.speciality.id.toString(),
      ws.speciality.name,
      ws.speciality.createdAt
    )
    if ( spec instanceof Errors ) {
      return left( spec.values )
    }
    specialities.push( spec )
  }

  const userMapped = UserAuth.fromPrimitives(
    w.user.id.toString(),
    w.user.email,
    w.user.username,
    w.user.name,
    w.user.createdAt,
    w.user.role,
    w.user.status,
    w.user.avatar
  )

  if ( userMapped instanceof Errors ) {
    return left( userMapped.values )
  }

  // const nationalIdentityDatabase = w.nationalIdentity
  // const countryDatabase          = nationalIdentityDatabase.country
  // const country                  = Country.fromPrimitives(
  //   countryDatabase.id.toString(),
  //   countryDatabase.name,
  //   countryDatabase.code,
  //   countryDatabase.createdAt
  // )
  // if ( country instanceof Errors ) {
  //   return left( country.values )
  // }
  // const nationalIdentity = NationalIdentityFormat.fromPrimitives(
  //   nationalIdentityDatabase.id.toString(),
  //   nationalIdentityDatabase.identifier,
  //   nationalIdentityDatabase.type,
  //   country as Country,
  //   nationalIdentityDatabase.createdAt
  // )
  // if ( nationalIdentity instanceof Errors ) {
  //   return left( nationalIdentity.values )
  // }
  return right( {
    user: userMapped,
    // nationalIdentity: nationalIdentity,
    specialities: specialities,
    taxes       : taxes
    // certificates    : certificates,
    // workZones       : [],
    // bookings        : [],
    // packages        : [],
    // reviews         : [],
    // schedule        : [],
    // stories         : [],
  } )
}

export class PrismaWorkerData implements WorkerDAO {
  constructor( private readonly db: PrismaClient ) {
  }


  async add( worker: Worker ): Promise<Either<BaseException, boolean>> {
    try {
      const r = await this.db.worker.create( {
        data: {
          id                      : worker.user.userId.toString(),
          birthDate               : worker.birthDate.toString(),
          description             : worker.description?.value,
          reviewCount             : worker.reviewCount.value,
          reviewAverage           : worker.reviewAverage.value,
          location                : worker.location.toPoint(),
          status                  : worker.status.value,
          nationalIdentityValue   : worker.nationalIdentityValue.value,
          nationalIdentityFormatId: worker.nationalIdentityId.toString(),
          createdAt               : worker.createdAt.toString(),
          verifiedAt              : null
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async remove( userId: ValidString ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.worker.delete( {
        where: {
          id: userId.value
        }
      } )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], PaginatedResult<Worker>>> {
    try {
      let idsCount: number | undefined = undefined

      const where = {}

      if ( query.id ) {
        // @ts-ignore
        where["id"] = {
          equals: query.id
        }
      }
      if ( query.status ) {
        // @ts-ignore
        where["status"] = {
          equals: query.status
        }
      }
      if ( query.ids ) {
        const arr: string[] = query.ids.split( "," )
        const ids           = arr.map( i => UUID.from( i ).toString() )
        idsCount            = ids.length === 0 ? -1 : ids.length
        // @ts-ignore
        where["id"]         = {
          in: ids
        }
      }
      if ( query.specialities ) {
        const arr: string[]       = query.specialities.split( "," )
        const ids                 = arr.map( i => UUID.from( i ).toString() )
        idsCount                  = ids.length === 0 ? -1 : ids.length
        // @ts-ignore
        where["WorkerSpeciality"] = {
          some: {
            specialityId: {
              in: ids
            }
          }
        }
      }
      if ( query.email ) {
        // @ts-ignore
        where["user"] = {
          email: query.email
        }
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }
      const offset                 = skip ? parseInt( skip.value ) : 0
      const results                = await this.db.$transaction( [
        this.db.worker.findMany( {
          where  : where,
          orderBy: orderBy,
          skip   : offset,
          take   : limit?.value,
          include: {
            user            : true,
            WorkerTax       : true,
            WorkerSpeciality: {
              include: {
                speciality: true
              }
            }
          }
        } ),
        this.db.worker.count( {
          where: where
        } )
      ] )
      const [response, totalCount] = results

      if ( idsCount && response.length !== idsCount ) {
        return left( [new InfrastructureException( "Not all workers found" )] )
      }

      const workers: Worker[] = []

      for ( const w of response ) {
        const relationMapped = await mapWorkerRelations( w )
        if ( isLeft( relationMapped ) ) {
          return left( relationMapped.left )
        }
        const mapped = Worker.fromPrimitives(
          relationMapped.right.user,
          w.nationalIdentityFormatId,
          w.nationalIdentityValue,
          w.birthDate,
          w.reviewCount,
          w.reviewAverage.toNumber(),
          w.location,
          w.status,
          relationMapped.right.specialities,
          relationMapped.right.taxes,
          w.createdAt,
          w.verifiedAt ? w.verifiedAt : undefined,
          w.description ? w.description : undefined
        )
        if ( mapped instanceof Errors ) {
          return left( mapped.values )
        }
        workers.push( mapped )
      }
      return right( {
        items: workers,
        total: totalCount
      } )
    }
    catch ( e ) {
      return left( [new InfrastructureException()] )
    }
  }

  async update( worker: Worker ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.workerSpeciality.deleteMany( {
          where: {
            workerId: worker.user.userId.toString()
          }
        } ),
        this.db.workerSpeciality.createMany( {
          data: worker.specialities.map( e => {
            return {
              workerId    : worker.user.userId.toString(),
              specialityId: e.id.toString()
            }
          } )
        } ),
        this.db.worker.update( {
          where: {
            id: worker.user.userId.toString()
          },
          data : {
            description  : worker.description?.value,
            reviewCount  : worker.reviewCount.value,
            reviewAverage: worker.reviewAverage.value,
            status       : worker.status.value,
            location     : worker.location.toPoint(),
            verifiedAt   : worker.verifiedAt
              ? worker.verifiedAt.toString()
              : null
          }
        } )
      ] )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }
}
