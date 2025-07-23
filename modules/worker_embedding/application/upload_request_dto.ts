import { z } from "zod"
import {
  UploadRequestTypeEnum
}            from "@/modules/worker_embedding/domain/upload_request_type"


export const uploadRequest = z.object( {
  info_text    : z.string(),
  process_input: z.string(),
  status: z.nativeEnum(UploadRequestTypeEnum),
} )

export type UploadRequestDTO = z.infer<typeof uploadRequest>

