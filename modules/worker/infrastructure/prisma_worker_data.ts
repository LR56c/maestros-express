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
import { User }                        from "@/modules/user/domain/user"
import { Country }                     from "@/modules/country/domain/country"
import {
  NationalIdentity
}                                      from "@/modules/national_identity/domain/national_identity"
import {
  Speciality
}                                      from "@/modules/speciality/domain/speciality"
import {
  WorkerTax
}                                      from "@/modules/worker_tax/domain/worker_tax"
import { Role }                        from "@/modules/role/domain/role"

type WorkerRelations = {
  user: User,
  nationalIdentity: NationalIdentity,
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

export class PrismaWorkerData implements WorkerDAO {
  constructor( private readonly db: PrismaClient ) {
  }

  private async mapWorkerRelations( w: any ): Promise<Either<BaseException[], WorkerRelations>> {
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

    const roles : Role[] = []
    for ( const ur of  w.user.usersRoles) {
      const role = Role.fromPrimitives(
        ur.role.id.toString(),
        ur.role.name,
        ur.role.createdAt,
        ur.role.updatedAt
      )
      if ( role instanceof Errors ) {
        return left( role.values )
      }
      roles.push( role )
    }
    const userMapped = User.fromPrimitive(
      w.user.id.toString(),
      w.user.email,
      w.user.name,
      w.user.surname,
      roles,
      w.user.createdAt,
      w.user.avatar
    )
    if ( userMapped instanceof Errors ) {
      return left( userMapped.values )
    }
    const nationalIdentityDatabase = w.nationalIdentity
    const countryDatabase          = nationalIdentityDatabase.country
    const country                  = Country.fromPrimitives(
      countryDatabase.id.toString(),
      countryDatabase.name,
      countryDatabase.code,
      countryDatabase.createdAt
    )
    if ( country instanceof Errors ) {
      return left( country.values )
    }
    const nationalIdentity = NationalIdentity.fromPrimitives(
      nationalIdentityDatabase.id.toString(),
      nationalIdentityDatabase.identifier,
      nationalIdentityDatabase.type,
      country as Country,
      nationalIdentityDatabase.createdAt
    )
    if ( nationalIdentity instanceof Errors ) {
      return left( nationalIdentity.values )
    }
    return right( {
      user            : userMapped,
      nationalIdentity: nationalIdentity,
      specialities    : specialities,
      taxes           : taxes
      // certificates    : certificates,
      // workZones       : [],
      // bookings        : [],
      // packages        : [],
      // reviews         : [],
      // schedule        : [],
      // stories         : [],
    } )
  }

  async add( worker: Worker ): Promise<Either<BaseException, boolean>> {
    try {
      await this.db.$transaction( [
        this.db.nationalIdentity.create( {
          data: {
            id        : worker.nationalIdentity.id.toString(),
            identifier: worker.nationalIdentity.identifier.value,
            type      : worker.nationalIdentity.type.value,
            countryId : worker.nationalIdentity.country.id.toString()
          }
        } ),
        this.db.worker.create( {
          data: {
            id                : worker.user.userId.toString(),
            birthDate         : worker.birthDate.toString(),
            description       : worker.description?.value,
            reviewCount       : worker.reviewCount.value,
            reviewAverage     : worker.reviewAverage.value,
            status            : worker.status.value,
            location          : worker.location.value,
            nationalIdentityId: worker.nationalIdentity.id.toString()
          }
        } )
      ] )
      return right( true )
    }
    catch ( e ) {
      return left( new InfrastructureException() )
    }
  }

  async search( query: Record<string, any>, limit?: ValidInteger,
    skip?: ValidString,
    sortBy?: ValidString,
    sortType?: ValidString ): Promise<Either<BaseException[], Worker[]>> {
    try {
      const where = {}
      if ( query.id ) {
        // @ts-ignore
        where["id"] = {
          equals: query.id
        }
      }
      const orderBy = {}
      if ( sortBy ) {
        const key    = changeCase.camelCase( sortBy.value )
        // @ts-ignore
        orderBy[key] = sortType ? sortType.value : "desc"
      }
      const offset            = skip ? parseInt( skip.value ) : 0
      const response          = await this.db.worker.findMany( {
        where  : where,
        orderBy: orderBy,
        skip   : offset,
        take   : limit?.value,
        include: {
          user            : {
            include: {
              usersRoles: {
                include: {
                  role: true
                }
              }
            }
          },
          nationalIdentity: {
            include: {
              country: true
            }
          },
          WorkerSpeciality: {
            include: {
              speciality: true
            }
          },
          WorkerTax: true
        }
      } )
      const workers: Worker[] = []
      console.log("Worker Response from DB: ", response)
      for ( const w of response ) {
        const relationMapped = await this.mapWorkerRelations( w )
        if ( isLeft( relationMapped ) ) {
          return left( relationMapped.left )
        }

        const mapped = Worker.fromPrimitives(
          relationMapped.right.user,
          relationMapped.right.nationalIdentity,
          w.birthDate,
          w.reviewCount,
          w.reviewAverage,
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
      return right( workers )
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
            location     : worker.location.value
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
