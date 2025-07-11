"use client"
import { useQuery }                   from "@tanstack/react-query"
import { sectorsOption }              from "@/utils/tanstack_catalog"
import {
  MultiSelectInputValue
}                                     from "@/components/form/multi_select_input"
import React, { useEffect, useState } from "react"
import { parseSectors }               from "@/utils/multi_select_parser"
import { Textarea }                   from "@/components/ui/textarea"
import { Search }                     from "lucide-react"
import { DropzoneOptions }            from "react-dropzone"
import FileUpload                     from "@/components/form/file_upload"
import { Button }                     from "@/components/ui/button"

export default function Home() {
  const { isPending: sectorPending, data: sectorData } = useQuery(
    sectorsOption )
  const [sectorValues, setSectorValues]                = useState<MultiSelectInputValue[]>(
    [] )
  useEffect( () => {
    setSectorValues( parseSectors( sectorData ?? [] ) )
  }, [sectorData] )


  const dropzone = {
    accept  : {
      "image/*": [".jpg", ".jpeg", ".png"],
      "pdf"    : [".pdf"]
    },
    multiple: true,
    maxFiles: 4,
    maxSize : 1 * 1024 * 1024
  } satisfies DropzoneOptions

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-xl flex flex-col gap-2">
        <div className="w-full max-w-xl flex h-16 gap-2">
          <div className="w-full h-full relative">
            <Search
              className="absolute left-2.5 top-5 transform -translate-y-1/2 h-5 w-5 text-gray-400"/>
            <Textarea
              onClick={ e => e.stopPropagation() }
              placeholder="Describe tu problema"
              rows={ 2 }
              className="resize-none pl-10 h-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              onChange={ ( value ) => console.log( "value", value ) }/>
          </div>
          <FileUpload
            inputClass="h-16 w-full"
            placeholder="o sube una imagen aqui"
            onChange={ value => console.log( "value", value ) }
            dropzone={ dropzone }/>
        </div>
        <Button className="w-full">Buscar servicio</Button>
      </div>
    </div>
  )
}
