import { DropzoneOptions } from "react-dropzone"
import {
  useState
}                          from "react"
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem
}                          from "@/components/form/file_upload_lib"
import {
  cn
}                          from "@/lib/utils"


interface FileUploadProps {
  placeholder?: string
  inputClass?: string
  onChange?: ( files: File[] | null ) => void
  dropzone: DropzoneOptions
}

export default function FileUpload( {
  dropzone, placeholder, onChange, inputClass
}: FileUploadProps )
{
  const [files, setFiles] = useState<File[] | null>( [] )
  const handleChange      = ( newFiles: File[] | null ) => {
    setFiles( newFiles )
    onChange?.( newFiles )
  }

  return (
    <FileUploader
      value={ files }
      onValueChange={ handleChange }
      dropzoneOptions={ dropzone }
    >
      <FileInput>
        <div
          className={cn('flex items-center justify-center h-24 w-full border hover:border-gray-400 bg-background rounded-md', inputClass)}>
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
  )
}
