import { UUID }   from "@/modules/shared/domain/value_objects/uuid"
import { Story }  from "@/modules/story/domain/story"
import { Either } from "fp-ts/Either"
import {
  BaseException
}                 from "@/modules/shared/domain/exceptions/base_exception"

export abstract class StoryDAO {
  abstract upsert( workerId: UUID, stories: Story[] ): Promise<Either<BaseException, boolean>>
  abstract add( workerId: UUID, story: Story ): Promise<Either<BaseException, boolean>>
  abstract update( workerId: UUID, story: Story ): Promise<Either<BaseException, boolean>>
  abstract remove( id: UUID ): Promise<Either<BaseException, boolean>>
  abstract getByWorker( workerId: UUID ): Promise<Either<BaseException[], Story[]>>
  abstract getById( id: UUID ): Promise<Either<BaseException[], Story>>
}
