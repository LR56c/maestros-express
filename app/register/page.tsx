"use client"
import { useState }                                   from "react"
import { authClient, hasAdmin, hasClient, hasWorker } from "@/lib/auth_client"
import { logoutUser }                                 from "@/app/actions/auth/logout"
import { updateUser } from "@/app/actions/auth/update"


export default function Register() {
  const [email, setEmail]                            = useState( "" )
  const [pass, setPass]                              = useState( "" )
  const [name, setName]                              = useState( "" )
  const { data: session, error, isPending, refetch } = authClient.useSession()
  const onLogout                                     = async () => {
    await logoutUser()
    // console.log("session", session, error, isPending)
    // const isClient = hasClient
    // const isWorker = hasWorker
    // const isAdmin = hasAdmin
    // console.log("isClient", isClient, "isWorker", isWorker, "isAdmin", isAdmin.data.success)
  }
  const onRegister                                   = async () => {
    // await updateUser( {
    //   email: "abc@gmail.com",
    //   role: "worker"
    // } )
    // await loginUser( {
    //   email   : email,
    //   password: pass
    // } )
  }
  return (
    <form className="flex flex-col">
      <label htmlFor="email">Email:</label>
      <input id="email" name="email"
             value={ email }
             onChange={ ( e ) => setEmail( e.target.value ) }
             type="email" required/>
      <label htmlFor="password">Password:</label>
      <input id="password"
             name="password"
             value={ pass }
             onChange={ ( e ) => setPass( e.target.value ) }
             type="password"
             required/>
      <label htmlFor="name">Name:</label>
      <input id="name"
             name="name"
             value={ name }
             onChange={ ( e ) => setName( e.target.value ) }
             type="text"
             required/>
      <button type="button" onClick={ onRegister }>Sign up</button>
      <button type="button" onClick={ onLogout }>logout</button>
    </form>
  )
}