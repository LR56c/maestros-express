"use client"
import { UserResponse }             from "@/modules/user/application/models/user_response"
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
}                                   from "react"
import {
  UserLoginRequest
}                                   from "@/modules/user/application/models/user_login_request"
import {
  UserRegisterRequest
}                                   from "@/modules/user/application/models/user_register_request"
import {
  SupabaseUserData
}                                   from "@/modules/user/infrastructure/supabase_user_data"
import {
  AuthAppService
}                                   from "@/modules/user/application/auth_app_service"
import {
  createClient
}                                   from "@/utils/supabase/client"
import {
  RoleLevelType,
  RoleType
}                                   from "@/modules/user/domain/role_type"
import {
  wrapType,
  wrapTypeAsync
}                                   from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                                   from "@/modules/shared/domain/exceptions/base_exception"
import {
  WorkerStatusEnum
}                                   from "@/modules/worker/domain/worker_status"
import {
  usePathname,
  useRouter
}                                   from "next/navigation"
import {
  parseAuthResponse
}                                   from "@/utils/auth_parser"
import { uploadDocument, uploader } from "@/app/context/worker_context"
import { base64ToFile }             from "@/utils/file_to_base"
import { isLeft }                   from "fp-ts/Either"

interface AuthContextType {
  user?: UserResponse

  anonymous(): Promise<void>

  login( request: UserLoginRequest ): Promise<boolean>

  logout( token?: string ): Promise<void>

  revalidate( token?: string ): Promise<void>

  register( request: any ): Promise<boolean>

  hasAccess( level: RoleLevelType ): Promise<boolean>
}


const AuthContext             = createContext<AuthContextType | undefined>(
  undefined )
const service: AuthAppService = new SupabaseUserData( createClient() )


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
      router.replace( "/trabajador/aplicar" )
    }
  }


  useEffect( () => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async ( event, session ) => {
        const parsed = parseAuthResponse( session?.user )
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
        router.refresh()
      }
      else {
        setUser( parseAuthResponse( data?.session?.user ) )
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

  const register = async ( request: any ) => {
    let avatarImg: string| undefined = undefined
    if ( request.avatar && request.avatar_name ) {
      const file      = base64ToFile( request.avatar_name, request.avatar )
      const uploadRes = await uploadDocument( uploader, [file] )
      if ( isLeft( uploadRes ) ) {
        return false
      }
      avatarImg = uploadRes.right[0].url
    }
    const userResponse = await wrapTypeAsync( () => service.register( {
      email    : request.email,
      full_name: request.full_name,
      username : request.username,
      avatar   : avatarImg,
      password: request.password,
    } ) )

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