"use server"
import { createClientServer } from "@/utils/supabase/server"
import { redirect }           from "next/navigation"

export default async function AdminLayout( {
  children
}: Readonly<{
  children: React.ReactNode;
}> )

{
  const sup                = await createClientServer()
  const { data: { user } } = await sup.auth.getUser()

  const isAdmin     = user?.user_metadata.role === "ADMIN"


  if( !isAdmin ) {
    return redirect("/")
  }

  return children
}