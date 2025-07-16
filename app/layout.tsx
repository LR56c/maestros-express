import type { Metadata }     from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Providers             from "@/app/providers"
import { ReactScan }         from "@/app/react_scan"
import { MyNav }             from "@/components/my_nav"
import { SidebarProvider }   from "@/components/ui/sidebar"
import { MySidebar }         from "@/components/my_sidebar"

const geistSans = Geist( {
  variable: "--font-geist-sans",
  subsets : ["latin"]
} )

const geistMono = Geist_Mono( {
  variable: "--font-geist-mono",
  subsets : ["latin"]
} )

export const metadata: Metadata = {
  title: "Maestros Express"
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
      className={ `${ geistSans.variable } ${ geistMono.variable } antialiased` }>
    <ReactScan/>
    <Providers>
      <SidebarProvider>
        <MySidebar/>
        <div className="flex flex-col w-full min-h-svh">
          <MyNav/>
          { children }
        </div>
      </SidebarProvider>
    </Providers>
    </body>
    </html>
  )
}
