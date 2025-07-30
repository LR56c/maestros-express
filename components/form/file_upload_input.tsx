import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem
}                          from "@/components/form/file_upload_lib"
import React, { useState } from "react"
import { DropzoneOptions } from "react-dropzone"
import { useFormContext }  from "react-hook-form"
import {
  getNestedErrorObject
}                          from "@/utils/get_nested_error_object"
import { Label }           from "@/components/ui/label"
import { HelpCircle }      from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
}                          from "@/components/ui/tooltip"

interface FileUploadInputProps {
  placeholder?: string
  helperText?: string
  name: string
  label: string
  onChange?: ( files: File[] | null ) => void
  dropzone: DropzoneOptions
}

export default function FileUploadInput( {
  dropzone,
  name,
  placeholder,
  label,
  onChange,
  helperText
}: FileUploadInputProps )
{
  const [files, setFiles]         = useState<File[] | null>( [] )
  const { formState: { errors } } = useFormContext()
  const errorMessage              = getNestedErrorObject( errors,
    name )?.message as string | undefined

  const handleChange = ( newFiles: File[] | null ) => {
    setFiles( newFiles )
    onChange?.( newFiles )
  }
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <Label className="font-semibold" htmlFor={ name }>{ label }</Label>
        { helperText ?
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground"/>
              </TooltipTrigger>
            <TooltipContent>
              <p>{ helperText }</p>
            </TooltipContent>
          </Tooltip>
          : null }
      </div>
      <FileUploader
        value={ files }
        onValueChange={ handleChange }
        dropzoneOptions={ dropzone }
      >
        <FileInput>
          <div
            className="flex items-center justify-center h-24 w-full border hover:border-gray-400 bg-background rounded-md">
            <p className="text-gray-400">{ placeholder
              ? placeholder
              : "Drop files here" }</p>
          </div>
        </FileInput>
        <FileUploaderContent className="flex items-center flex-row gap-2">
          { files?.map( ( file, i ) => (
            <FileUploaderItem
              key={ i }
              index={ i }
              className="size-20 p-0 rounded-md overflow-hidden"
              aria-roledescription={ `file ${ i +
              1 } containing ${ file.name }` }
            >
              <img
                src={ URL.createObjectURL( file ) }
                alt={ file.name }
                height={ 80 }
                width={ 80 }
                className="size-20 p-0"
              />
            </FileUploaderItem>
          ) ) }
        </FileUploaderContent>
      </FileUploader>
      {
        errorMessage
          ?
          <p className="text-red-500 text-sm">{ errorMessage }</p>
          : null
      }
    </div>
  )
}