import { ChatResponse } from "@/modules/chat/application/chat_response"

export abstract class ChatAppService {
  abstract add( chat : ChatResponse ): Promise<void>
  abstract update( chat : ChatResponse ): Promise<void>
  abstract getByUser( userId : string ): Promise<ChatResponse[]>
}