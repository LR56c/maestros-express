"use client"
import { Button }                from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle
}                                from "@/components/ui/dialog"
import { FormProvider, useForm } from "react-hook-form"
import {
  zodResolver
}                                from "@hookform/resolvers/zod"
import InputText                 from "@/components/form/input_text"
import React, { useMemo }        from "react"
import {
  UUID
}                                from "@/modules/shared/domain/value_objects/uuid"
import {
  ListInputModalProps
}                                from "@/components/form/list_input"
import {
  storySchema
}                                from "@/modules/story/application/story_dto"
import FileUploadInput           from "@/components/form/file_upload_input"
import { DropzoneOptions }       from "react-dropzone"
import { z }                     from "zod"
import {
  wrapType
}                                from "@/modules/shared/utils/wrap_type"
import {
  StoryDocumentType,
  StoryDocumentTypeEnum
}                                from "@/modules/story/modules/story_document/domain/story_document_type"
import {
  BaseException
}                                from "@/modules/shared/domain/exceptions/base_exception"
import {
  parseData
}                                from "@/modules/shared/application/parse_handlers"
import { isLeft }                from "fp-ts/Either"


const storyDocumentFormSchema = z.instanceof( File ).refine(
  ( file ) => {
    const typePart = file.type.split( "/" )[ 0 ]
    const type = wrapType( () => StoryDocumentType.from( typePart.toUpperCase() ) )
    return !(
      type instanceof BaseException
    )
  },
  {
    message: `Solo se aceptan archivos de tipo: ${ Object.values(
      StoryDocumentTypeEnum ).join(', ') }`
  }
)
export type StoryDocumentForm = z.infer<typeof storyDocumentFormSchema>


export const storyFormSchema = storySchema.merge( z.object( {
    documents: z.array( storyDocumentFormSchema )
  } )
)
export type StoryForm = z.infer<typeof storyFormSchema>
export const StoryDialog: React.FC<ListInputModalProps> = ( {
  isOpen,
  onOpenChange,
  title,
  formData,
  onSave
} ) =>
{
  const initialValues = useMemo( () => {
    if ( Object.keys( formData ).length === 0 ) {
      return { id: UUID.create().toString() }
    }
    return formData
  }, [formData] )

  const methods = useForm( {
    resolver: zodResolver( storyFormSchema ),
    values  : initialValues
  } )

  const { handleSubmit, setValue } = methods

  const onSubmit = async ( data: any ) => {
    console.log( "Form submitted with data:", data )
    onSave( data )
  }

  const dropzone = {
    accept  : {
      "image/*": [".jpg", ".jpeg", ".png"]
    },
    multiple: true,
    maxFiles: 4,
    maxSize : 1 * 1024 * 1024
  } satisfies DropzoneOptions

  const paseFileStoryDocuments = ( files: File[] | null ) => {
      if( !files || files.length === 0 ) {
        setValue( "documents", [] )
        return
      }
      let docFiles: StoryDocumentForm[] = []
      for ( const file of files ) {
        const parsedFileResult = parseData( storyDocumentFormSchema, file )
        if ( isLeft( parsedFileResult ) ) {
          docFiles = []
          break
        }
        docFiles.push( parsedFileResult.right )
      }
      setValue( "documents", docFiles )
  }

  return (
    <FormProvider { ...methods } >
      <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
        <DialogContent className="sm:max-w-md w-full">
          <DialogTitle>{ title }</DialogTitle>
          <InputText name="name" label="Nombre de trabajo" type="text"
                     placeholder="Ingrese nombre de trabajo"/>
          <InputText name="description" label="Descripcion" type="text"
                     placeholder="Ingrese descripcion del trabajo"/>
          <FileUploadInput
            onChange={ paseFileStoryDocuments }
            helperText="Imagenes sobre trabajos realizados"
            placeholder="Suelta los archivos aquí o haz click para subir"
            name="documents" label="Imagenes" dropzone={ dropzone }/>
          <Button type="button"
                  onClick={ handleSubmit( onSubmit ) }>Guardar</Button>
        </DialogContent>
      </Dialog>
    </FormProvider>
  )
}
