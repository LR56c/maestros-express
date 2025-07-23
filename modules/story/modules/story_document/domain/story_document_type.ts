import { z } from "zod"
import {
  InvalidStoryDocumentTypeException
}            from "@/modules/story/modules/story_document/domain/exception/invalid_story_document_type_exception"

export enum StoryDocumentTypeEnum {
  VIDEO = "VIDEO",
  IMAGE = "IMAGE"
}

export class StoryDocumentType {

  readonly value: StoryDocumentTypeEnum

  private constructor( value: StoryDocumentTypeEnum ) {
    this.value = value
  }

  static create( value: StoryDocumentTypeEnum ): StoryDocumentType {
    return new StoryDocumentType( value )
  }

  static from( value: string ): StoryDocumentType {
    const result = z.nativeEnum( StoryDocumentTypeEnum )
                    .safeParse( value )
    if ( !result.success ) {
      throw new InvalidStoryDocumentTypeException()
    }
    return new StoryDocumentType( result.data )
  }

  static fromOrNull( value: string ): StoryDocumentType | undefined {
    try {
      return StoryDocumentType.from( value )
    }
    catch {
      return undefined
    }
  }
}
