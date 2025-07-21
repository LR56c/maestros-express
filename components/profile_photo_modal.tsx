"use client"

import React, { useState }     from "react"
import Image                   from "next/image"
import { Camera, Loader2Icon } from "lucide-react"
import {
  Button
}                              from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
}                              from "@/components/ui/dialog"
import {
  Input
}                              from "@/components/ui/input"
import {
  Label
}                              from "@/components/ui/label"
import {
  useMutation
}                              from "@tanstack/react-query"
import { toast }               from "sonner"
import {
  UploadFileRepository
}                              from "@/modules/shared/domain/upload_file_repository"
import {
  SupabaseFileUploadData
}                              from "@/modules/shared/infrastructure/supabase_file_upload_data"
import {
  createClient
}                              from "@/utils/supabase/client"
import {
  wrapTypeAsync
}                              from "@/modules/shared/utils/wrap_type"

interface ProfilePhotoModalProps {
  avatar: string | null
  isOpen: boolean
  onOpenChange: ( open: boolean ) => void
  onSaved: () => void
}

const uploader: UploadFileRepository = new SupabaseFileUploadData(
  createClient() )

export default function ProfilePhotoModal( {
  avatar,
  isOpen,
  onOpenChange,
  onSaved
}: ProfilePhotoModalProps )
{
  const [imageName, setImageName]                     = useState<string | null>(
    null )
  const [currentProfileImage, setCurrentProfileImage] = useState<File | null>(
    null )
  const [imageString, setImageString]                 = useState<string | null>(
    avatar )

  const { data, mutateAsync, status } = useMutation( {
    mutationFn: async ( values: any ) => {
      const response = await fetch( "/api/user", {
        method : "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body   : JSON.stringify( values )
      } )
      if ( !response.ok ) {
        return undefined
      }
      return await response.json()
    },
    onError   : ( error, variables, context ) => {
      toast.error( "Error. Por favor, intenta de nuevo." )
    }
  } )


  const handleImageChange = ( event: React.ChangeEvent<HTMLInputElement> ) => {
    const file = event.target.files?.[0]
    if ( file ) {
      const reader  = new FileReader()
      reader.onload = ( e ) => {
        setImageString( e.target?.result as string )
      }
      reader.readAsDataURL( file )
      setCurrentProfileImage( file )
      setImageName( `${ file.name }-${ Date.now() }` )
    }
  }

  const handleSaveImage = async () => {
    const url = await wrapTypeAsync(
      () => uploader.add( imageName!, currentProfileImage! ) )
    if ( !url ) {
      toast.error( "Error al subir la imagen. Por favor, intenta de nuevo." )
      return
    }
    const result = await mutateAsync( {
      avatar: url
    } )
    if ( !result ) {
      await uploader.remove( [imageName!] )
      return
    }
    onOpenChange( false )
    onSaved()
  }

  return (
    <Dialog open={ isOpen } onOpenChange={ onOpenChange }>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cambiar foto de perfil</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center">
            <div
              className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200">
              { imageString ?
                <Image
                  src={ imageString }
                  alt="Preview"
                  width={ 128 }
                  height={ 128 }
                  className="object-cover w-full h-full"
                /> :
                <div
                  className="flex items-center justify-center w-full h-full bg-gray-200">
                  <span className="text-gray-500">Sin foto</span>
                </div> }
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo-upload">Seleccionar imagen</Label>
            <Input id="photo-upload" type="file" accept="image/*"
                   onChange={ handleImageChange } className="flex-1"/>
          </div>

          <Button onClick={ handleSaveImage }
                  disabled={
                    !currentProfileImage || status === "pending" ||
                    !imageName || !imageString
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700">
            {
              status === "pending" ?
                <>
                  <Loader2Icon className="animate-spin"/>
                  Guardando...
                </>
                :
                <>
                  <Camera className="w-4 h-4 mr-2"/>
                  Guardar foto
                </>
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
