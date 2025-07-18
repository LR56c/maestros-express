"use server"
import { searchUser } from "@/app/api/dependencies"
import { isLeft }     from "fp-ts/Either"
import { UserMapper } from "@/modules/user/application/user_mapper"
import { redirect }   from "next/navigation"
import { ProfileDetail } from "@/components/profile_detail"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DetallePerfil( { params }: PageProps ) {
  const { id } = await params
  const result = await (
    await searchUser()
  ).execute( {
    id
  } )
  if ( isLeft( result ) ) {
    throw new Error()
  }
  const users = result.right.items.map( UserMapper.toDTO )
  if ( users.length === 0 ) {
    throw new Error( "User not found" )
  }
  const profile = users[0]
  if ( profile.role === "WORKER" ) {
    return redirect( "/trabajador/" + id )
  }

  return (
    <ProfileDetail profile={ profile }/>
  )
}