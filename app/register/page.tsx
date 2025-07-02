"use client"
import { useState }     from "react"
import { logoutAuth }   from "@/app/actions/auth/logout"
import { loginAuth }    from "@/app/actions/auth/login"
import { registerAuth } from "@/app/actions/auth/register"


export default function Register() {
  const [email, setEmail] = useState( "" )
  const [pass, setPass]   = useState( "" )
  const [name, setName] = useState("")
  const onLogout = async ()=>{
    await logoutAuth()
  }
  const onRegister        = async () => {
    await registerAuth( {
      email   : email,
      password: pass,
      name: name
    } )
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