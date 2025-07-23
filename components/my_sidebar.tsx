"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
}                                                   from "@/components/ui/sidebar"
import { ChevronUp, Home, Inbox, Moon, Sun, User2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
}                                                   from "@/components/ui/dropdown-menu"
import Link                                         from "next/link"
import { useRouter }                                from "next/navigation"
import {
  useAuthContext
}                                                   from "@/app/context/auth_context"
import { useTheme }                                 from "next-themes"
import * as React                                   from "react"

const items = [
  {
    title: "Inicio",
    url  : "/",
    icon : Home
  },
  {
    title: "Mensajes",
    url  : "/chat",
    icon : Inbox
  },
  // {
  //   title: "Notificaciones",
  //   url  : "/notificaciones",
  //   icon : Bell
  // }
]

export function MySidebar() {
  const { user, logout } = useAuthContext()
  const { setTheme }     = useTheme()
  const router           = useRouter()
  const handleLogout     = async () => {
    await logout()
    router.push( "/" )
  }
  const isAnonymous      = !user || user.role === "PUBLIC"

  if ( isAnonymous ) {
    return null
  }

  const isAdmin = user && user.role === "ADMIN"

  const handleProfile = () => {
    if ( user.role === "WORKER" ) {
      return `/trabajador/${ user.user_id }`
    }
    else {
      return `/perfil/${ user.user_id }`
    }
  }

  return (
    <Sidebar>
      <SidebarHeader/>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Maestros Express</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              { items.map( ( item ) => (
                <SidebarMenuItem key={ item.title }>
                  <SidebarMenuButton size="lg" asChild>
                    <a href={ item.url }>
                      <item.icon/>
                      <span>{ item.title }</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) ) }
              <SidebarMenuItem className="pt-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <Sun
                        className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"/>
                      <Moon
                        className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"/>
                      <span>Cambiar Tema</span>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={ () => setTheme( "light" ) }>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={ () => setTheme( "dark" ) }>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={ () => setTheme( "system" ) }>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
              { isAdmin ? (
                <SidebarMenuItem className="pt-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton>
                        <p>Admin</p>
                        <ChevronUp className="ml-auto"/>
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      side="bottom"
                      className="w-[--radix-popper-anchor-width]"
                    >
                      <Link href="/admin/paises">
                        <DropdownMenuItem>
                          <span>Paises</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/admin/regiones">
                        <DropdownMenuItem>
                          <span>Regiones</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/admin/sectores">
                        <DropdownMenuItem>
                          <span>Sectores</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/admin/monedas">
                        <DropdownMenuItem>
                          <span>Monedas</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/admin/identidad_nacional">
                        <DropdownMenuItem>
                          <span>Identidad Nacional</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/admin/formato_telefono">
                        <DropdownMenuItem>
                          <span>Formato Telefono</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/admin/especialidades">
                        <DropdownMenuItem>
                          <span>Especialidades</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/admin/pagos">
                        <DropdownMenuItem>
                          <span>Pagos</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/admin/reportes">
                        <DropdownMenuItem>
                          <span>Reportes</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/admin/usuarios">
                        <DropdownMenuItem>
                          <span>Usuarios</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/admin/trabajadores">
                        <DropdownMenuItem>
                          <span>Trabajadores</span>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ) : null }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2/>
                  <p className="line-clamp-1">{ user.full_name }</p>
                  <ChevronUp className="ml-auto"/>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <Link href={ handleProfile() }>
                  <DropdownMenuItem>
                    <span>Perfil</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem onClick={ handleLogout }>
                  <span>Cerrar sesion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}