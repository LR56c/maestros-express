import { StoryDTO } from "@/modules/story/application/story_dto"

export abstract class StoryAppService {
  abstract add( workerId: string,
    story: StoryDTO ): Promise<void>

  abstract update( workerId: string,
    story: StoryDTO ): Promise<void>

  abstract remove( id: string ): Promise<void>

  abstract getByWorker( workerId: string ): Promise<StoryDTO[]>
}