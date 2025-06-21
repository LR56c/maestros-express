import { ReviewDTO }   from "@/modules/review/application/review_dto"

export abstract class ReviewAppService {
  abstract add( review : ReviewDTO ): Promise<void>
  abstract getByUserId( id: string ): Promise<ReviewDTO[]>
}
