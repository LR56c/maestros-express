import type { Metadata }     from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Providers             from "@/app/providers"
import { ReactScan }         from "@/app/react_scan"
import { MyNav }             from "@/components/my_nav"

const geistSans = Geist( {
  variable: "--font-geist-sans",
  subsets : ["latin"]
} )

const geistMono = Geist_Mono( {
  variable: "--font-geist-mono",
  subsets : ["latin"]
} )

export const metadata: Metadata = {
  title      : "Maestros Express",
}


export default function RootLayout( {
  children
}: Readonly<{
  children: React.ReactNode;
}> )
{
  return (
    <html lang="en" suppressHydrationWarning>
    <body
      className={ `${ geistSans.variable } ${ geistMono.variable } antialiased` }

    >
    <ReactScan/>
    <Providers>
      <MyNav/>
      { children }
    </Providers>
    </body>
    </html>
  )
}
