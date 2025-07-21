"use client"

import Link         from "next/link"
import { StoryDTO } from "@/modules/story/application/story_dto"
import {
  StoryDocumentDTO
}                   from "@/modules/story/modules/story_document/application/story_document_dto"

interface HistoryCircleProps {
  story: StoryDTO
}

export default function HistoryCircle( { story }: HistoryCircleProps ) {
  const getFirstImage = ( documents: StoryDocumentDTO[] ) => {
    return documents.find( ( doc ) => doc.type === "IMAGE" )
  }

  const firstImage = getFirstImage( story.documents )
  return (
    <Link href={ `/historia/${ story.id }` }>
      <div
        className="flex flex-col items-center flex-shrink-0 cursor-pointer group">
        <div className="relative w-20 h-20 mb-2">
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-0.5">
            <div
              className="w-full h-full rounded-full bg-white p-0.5">
              <div
                className="relative w-full h-full rounded-full overflow-hidden">
                <img
                  src={ firstImage!.url }
                  alt={ story.name }
                  className="object-cover w-full h-full rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                />
              </div>
            </div>
          </div>
        </div>
        <span
          className="text-xs text-gray-700 text-center max-w-20 truncate font-medium">{ story.name }</span>
      </div>
    </Link>
  )
}
