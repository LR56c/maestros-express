import { ChatDTO } from "@/modules/chat/application/chat_dto"

export abstract class ChatAppService {
  abstract add( chat : ChatDTO ): Promise<void>
  abstract update( chat : ChatDTO ): Promise<void>
  abstract getByUser( userId : string ): Promise<ChatDTO[]>
}