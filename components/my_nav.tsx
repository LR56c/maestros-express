"use client"
import { Button }              from "@/components/ui/button"
import {
  ModeToggle
}                              from "@/components/mode_toggle"
import {
  useAuthContext
}                              from "@/app/context/auth_context"
import { MessageSquare, User } from "lucide-react"
import Link                    from "next/link"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
}                              from "@/components/ui/popover"
import { useRouter }           from "next/navigation"

export function MyNav() {
  const { user, logout } = useAuthContext()
  const isAnonymous      = !user || user.role === "PUBLIC"
  const verifiedProfile  = user && user.status !== "PUBLIC"
  const router           = useRouter()
  const handleLogout     = async () => {
    await logout()
    router.push( "/" )
  }
  return (
    <div className="flex justify-between items-center p-4">
      <Link href="/">
        <p>logo</p>
      </Link>
      <div className="flex justify-between items-center gap-4">
        <ModeToggle/>
        { isAnonymous ?
          <>
            <Link href="/trabajador/aplicar">
              <Button>Aplicar</Button>
            </Link>
            <Link href="/registrarse">
              <Button>Registrarse</Button>
            </Link>
            <Link href="/ingresar">
              <Button>Iniciar Sesion</Button>
            </Link>
          </> : verifiedProfile ?
            <>
              <Button variant="outline">
                <MessageSquare/>
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <User/>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col items-center gap-2">
                  <div>Hola { user.full_name }</div>
                  <div
                    className="text-sm text-muted-foreground">({ user.email })
                  </div>
                  <Button onClick={ handleLogout }>Cerrar sesion</Button>
                </PopoverContent>
              </Popover>
            </>
            : null
        }
      </div>
    </div>
  )
}