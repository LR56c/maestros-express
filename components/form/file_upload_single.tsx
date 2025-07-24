import { DropzoneOptions } from "react-dropzone"
import { useState }                from "react"
import {
  FileInput,
  FileUploader,
} from "@/components/form/file_upload_lib"
import { cn } from "@/lib/utils"


interface FileUploadSingleProps {
  placeholder?: string
  inputClass?: string
  fileClass?: string
  onChange?: ( files: File[] | null ) => void
  dropzone: DropzoneOptions
}

export default function FileUploadSingle( {
  dropzone, placeholder, onChange, inputClass,fileClass
}: FileUploadSingleProps )
{
  // Only allow a single file
  const [files, setFiles] = useState<File[] | null>( null )
  const handleChange      = ( newFiles: File[] | null ) => {
    // Only keep the first file if multiple are provided
    const singleFile = newFiles && newFiles.length > 0 ? [newFiles[0]] : null;
    setFiles( singleFile )
    onChange?.( singleFile )
  }

  return (
    <FileUploader
      value={ files }
      className={fileClass}
      onValueChange={ handleChange }
      dropzoneOptions={{ ...dropzone, maxFiles: 1 }}
    >
      <FileInput>
        <div
          className={cn(
            "relative flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 rounded-md",
            inputClass
          )}
        >
          {files && files.length > 0 ? (
            <img
              src={URL.createObjectURL(files[0])}
              alt={files[0].name}
              height={80}
              width={80}
              className="size-20 p-0 rounded-md overflow-hidden object-cover"
            />
          ) : (
            <p className="text-gray-400 text-center px-2">{ placeholder ? placeholder : "Drop files here" }</p>
          )}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={e => {
              const file = e.target.files && e.target.files[0] ? [e.target.files[0]] : null;
              setFiles(file);
              onChange?.(file);
            }}
            tabIndex={-1}
          />
        </div>
      </FileInput>
    </FileUploader>
  )
}
