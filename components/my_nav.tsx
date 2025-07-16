"use client"
import { Button }         from "@/components/ui/button"
import { ModeToggle }     from "@/components/mode_toggle"
import { useAuthContext } from "@/app/context/auth_context"
import Link               from "next/link"

export function MyNav() {
  const { user } = useAuthContext()
  const isAnonymous      = !user || user.role === "PUBLIC"
  // const verifiedProfile  = user && user.status !== "PUBLIC"

  if ( !isAnonymous ) {
    return null
  }

  return (
    <div className="flex justify-between items-center p-4">
      <Link href="/">
        <p>logo</p>
      </Link>
      <div className="flex justify-between items-center gap-4">
        <ModeToggle/>
        <Link href="/trabajador/aplicar">
          <Button>Aplicar</Button>
        </Link>
        <Link href="/registrarse">
          <Button>Registrarse</Button>
        </Link>
        <Link href="/ingresar">
          <Button>Iniciar Sesion</Button>
        </Link>
      </div>
    </div>
  )
}