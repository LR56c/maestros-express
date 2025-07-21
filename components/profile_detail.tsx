"use client"
import React, { useState } from "react"
import {
  UserResponse
}                          from "@/modules/user/application/models/user_response"
import Image               from "next/image"
import { Camera }          from "lucide-react"
import ProfilePhotoModal   from "@/components/profile_photo_modal"
import { useRouter }       from "next/navigation"
import { useAuthContext }  from "@/app/context/auth_context"

interface ProfileDetailProps {
  profile: UserResponse
}

export function ProfileDetail( { profile }: ProfileDetailProps ) {
  const [isModalOpen, setIsModalOpen] = useState( false )
  const router                        = useRouter()
  const { revalidate }                = useAuthContext()
  const handleSaved                   = async () => {
    await revalidate()
    router.refresh()
  }
  return (
    <>
      <div className="flex justify-center gap-4 p-4 w-full h-full">
        <div
          className="p-4 flex-1 flex-col max-w-md gap-4 ">
          <div className="flex gap-4 items-center ">
            <div className="relative group">
              <div
                className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 cursor-pointer transition-all duration-200 hover:border-blue-400 hover:shadow-lg"
                onClick={ () => setIsModalOpen( true ) }
              >
                { profile.avatar ?
                  <img
                    src={ profile.avatar }
                    alt="Foto de perfil"
                    className="object-cover"
                  />
                  :
                  <div
                    className="flex items-center justify-center w-full h-full bg-gray-200">
                    <span className="text-gray-500">Sin foto</span>
                  </div>
                }
                <div
                  className="absolute inset-0 bg-transparent bg-opacity-50 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                  <Camera
                    className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"/>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <p className="capitalize">{ profile.full_name }</p>
            </div>
          </div>
        </div>
      </div>
      <ProfilePhotoModal onSaved={ handleSaved }
                         avatar={ profile.avatar ?? null }
                         isOpen={ isModalOpen }
                         onOpenChange={ setIsModalOpen }/>
    </>
  )
}
