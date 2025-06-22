import { StoryDAO }     from "@/modules/story/domain/story_dao"
import { Either, left } from "fp-ts/Either"
import {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"
import { Story }        from "@/modules/story/domain/story"
import { wrapType }     from "@/modules/shared/utils/wrap_type"
import { UUID }         from "@/modules/shared/domain/value_objects/uuid"

export class GetStoryByWorker {
  constructor(private readonly dao : StoryDAO) {}

  async execute( workerId: string ): Promise<Either<BaseException[], Story[]>>{
    const vid =wrapType(()=>UUID.from(workerId))

    if(vid instanceof BaseException){
      return left([vid])
    }

    return await this.dao.getByWorker(vid as UUID)
  }
}