"use client"


import { Button } from "@/components/ui/button"
import { loginAnonymous } from "@/app/actions/auth/anonymous"

export default function Login() {
  const handleClick=async ()=>{
    await loginAnonymous()
  }
  return (
    <>
      <Button onClick={handleClick}>login anon</Button>
    </>
  )
}