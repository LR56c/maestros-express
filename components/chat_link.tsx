"use client"
import { useSelectedLayoutSegment } from "next/navigation"
import Link                         from "next/link"

export function ChatLink( {
  id,
  children
}: {
  id: string;
  children: React.ReactNode;
} )
{
  const seg      = useSelectedLayoutSegment()
  const isActive = seg === id

  return (
    <Link
      href={ `/chat/${ id }` }
      className={ `block rounded-lg px-3 py-2 ${
        isActive ? "bg-primary/5" : "hover:bg-muted/0"
      }` }
    >
      { children }
    </Link>
  )
}
