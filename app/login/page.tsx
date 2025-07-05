"use client"


import { Button } from "@/components/ui/button"
import { loginAnonymous } from "@/app/actions/auth/anonymous"

export default function Login() {
  const handleClick=async ()=>{
    const result = await loginAnonymous()
    console.log('result',result)
  }
  return (
    <>
      <Button onClick={handleClick}>login anon</Button>
    </>
  )
}