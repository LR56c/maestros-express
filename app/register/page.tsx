"use client"
import { registerAuth } from "@/app/actions/auth/register"
import { useState }     from "react"


export default function Register() {
  const [email, setEmail] = useState( "" )
  const [pass, setPass]   = useState( "" )

  const onRegister = async () => {
    const r = await registerAuth( {
      email   : email,
      password: pass
    } )
    console.log( "Client Register response:", r )
  }
  return (
    <form>
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
      <button type="button" onClick={ onRegister }>Sign up</button>
    </form>
  )
}