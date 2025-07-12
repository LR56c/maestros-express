import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h1>Página no encontrada</h1>
      <p>Lo sentimos, la página que estás buscando no existe.</p>
      <Link href="/">Volver a la página de inicio</Link>
    </div>
  )
}