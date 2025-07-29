import Link       from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh text-center gap-4">
      <h1>Página no encontrada</h1>
      <Link href="/">
        <Button>Volver a la página de inicio</Button>
      </Link>
    </div>
  )
}