"use client"
import { UserResponse } from "@/modules/user/application/models/user_response"
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
}                       from "react"
import {
  UserLoginRequest
}                       from "@/modules/user/application/models/user_login_request"
import {
  UserRegisterRequest
}                       from "@/modules/user/application/models/user_register_request"
import {
  SupabaseUserData
}                       from "@/modules/user/infrastructure/supabase_user_data"
import {
  AuthAppService
}                       from "@/modules/user/application/auth_app_service"
import {
  createClient
}                       from "@/utils/supabase/client"
import {
  RoleLevelType,
  RoleType
}                       from "@/modules/user/domain/role_type"
import {
  wrapType,
  wrapTypeAsync
}                       from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"
import {
  WorkerStatusEnum
}                       from "@/modules/worker/domain/worker_status"
import {
  usePathname,
  useRouter
}                       from "next/navigation"

interface AuthContextType {
  user?: UserResponse

  anonymous(): Promise<void>

  login( request: UserLoginRequest ): Promise<boolean>

  logout( token?: string ): Promise<void>

  revalidate( token?: string ): Promise<void>

  register( request: UserRegisterRequest ): Promise<boolean>

  hasAccess( level: RoleLevelType ): Promise<boolean>
}


const AuthContext             = createContext<AuthContextType | undefined>(
  undefined )
const service: AuthAppService = new SupabaseUserData( createClient() )

const parseResponse = ( user: any ): UserResponse | undefined => {
  if ( !user ) {
    return undefined
  }
  return {
    user_id  : user.id,
    email    : user.email || "",
    full_name: user.user_metadata?.name || "",
    role     : user.user_metadata?.role || "",
    status   : user.user_metadata?.status || "",
    avatar   : user.user_metadata.avatar
  } as UserResponse
}

export const AuthProvider = ( { children }: { children: ReactNode } ) => {
  const [user, setUser] = useState<UserResponse | undefined>( undefined )
  const supabase        = createClient()
  const pathname        = usePathname()
  const router          = useRouter()

  const checkWorker = async ( user?: UserResponse ) => {
    if ( !user ) return
    if ( pathname.startsWith( "/trabajador/aplicar" ) ) return
    const check = user.role === "WORKER" && user.status ===
      WorkerStatusEnum.INCOMPLETE
    if ( check ) {
      console.log( "User is not a worker, redirecting to apply page" )
      await router.replace( "/trabajador/aplicar" )
    }
  }


  useEffect( () => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async ( event, session ) => {
        const parsed = parseResponse( session?.user )
        if ( !user || (
          session?.user?.id && user.user_id !== session.user.id
        ) )
        {
          console.log( `User has changed(${ event })`,
            session?.user.user_metadata )
          setUser( parsed )
        }
        await checkWorker( parsed )
      } )
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [] )

  useEffect( () => {
    if ( user ) {
      return
    }
    const check = async () => {
      const { data, error } = await supabase.auth.getSession()
      if ( error || !data?.session ) {
        await anonymous()
        await router.refresh()
      }
      else {
        setUser( parseResponse( data?.session?.user ) )
      }
    }
    check()
  }, [] )

  const hasAccess = async ( level: RoleLevelType ): Promise<boolean> => {
    if ( !user ) {
      return false
    }
    const mappedRole = wrapType( () => RoleType.from( user.role ) )

    if ( mappedRole instanceof BaseException ) {
      return false
    }
    return mappedRole.value >= level
  }

  const anonymous = async () => {
    const userResponse = await service.anonymous()
    setUser( userResponse )
  }

  const login = async ( request: UserLoginRequest ) => {
    const userResponse = await wrapTypeAsync( () => service.login( request ) )

    if ( userResponse instanceof BaseException ) {
      return false
    }
    setUser( userResponse )
    return true
  }

  const logout = async ( token?: string ) => {
    await service.logout( token )
    setUser( undefined )
  }

  const register = async ( request: UserRegisterRequest ) => {
    const userResponse = await wrapTypeAsync(
      () => service.register( request ) )

    if ( userResponse instanceof BaseException ) {
      return false
    }
    setUser( userResponse )
    return true
  }

  const revalidate = async ( token?: string ): Promise<void> => {
    const userResponse = await service.revalidate( token )
    setUser( userResponse )
  }

  return (
    <AuthContext.Provider value={
      {
        user,
        anonymous,
        login,
        logout,
        register,
        hasAccess,
        revalidate
      }
    }>
      { children }
    </AuthContext.Provider>
  )
}

export const useAuthContext = () => {
  const context = useContext( AuthContext )
  if ( !context ) {
    throw new Error( "useAuthContext must be used within a AuthProvider" )
  }
  return context
}