"use client"
import { Button }              from "@/components/ui/button"
import { ModeToggle }          from "@/components/mode_toggle"
import { useAuthContext }      from "@/app/context/auth_context"
import { MessageSquare, User } from "lucide-react"
import Link                    from "next/link"

export function MyNav() {
  const { user }        = useAuthContext()
  const isAnonymous     = !user || user.role === "PUBLIC"
  const verifiedProfile = user && user.status === "VERIFIED"
  return (
    <div className="flex justify-between items-center p-4">
      <Link href="/">
        <p>logo</p>
      </Link>
      <div className="flex justify-between items-center gap-4">
        <ModeToggle/>
        { isAnonymous ?
          <>
            <Button>Iniciar Sesion</Button>
            <Button>Registrarse</Button>
          </> : verifiedProfile ?
            <>
              <Button variant="outline">
                <MessageSquare/>
              </Button>
              <Button variant="outline">
                <User/>
              </Button>
            </>
            : null
        }
      </div>
    </div>
  )
}