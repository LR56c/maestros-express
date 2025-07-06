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
  wrapType
}                       from "@/modules/shared/utils/wrap_type"
import {
  BaseException
}                       from "@/modules/shared/domain/exceptions/base_exception"

interface AuthContextType {
  user?: UserResponse

  anonymous(): Promise<void>

  login( request: UserLoginRequest ): Promise<void>

  logout( token?: string ): Promise<void>

  revalidate( token: string ): Promise<void>

  register( request: UserRegisterRequest ): Promise<void>

  hasAccess( level: RoleLevelType ): Promise<boolean>
}


const AuthContext             = createContext<AuthContextType | undefined>(
  undefined )
const service: AuthAppService = new SupabaseUserData( createClient() )

const parseResponse = ( response: any ): UserResponse | undefined => {
  if ( !response || !response.user ) {
    return undefined
  }
  const { user } = response
  return {
    user_id  : user.id,
    email    : user.email || "",
    full_name: user.user_metadata?.name || "",
    avatar   : user.user_metadata?.avatar || ""
  } as UserResponse
}

// supabase.auth.getUser().then(({ data }) => {
//   console.log("Initial user data:", data)
// })
export const AuthProvider = ( { children }: { children: ReactNode } ) => {
  const [user, setUser] = useState<UserResponse | undefined>( undefined )

  useEffect( () => {
    const supabase           = createClient()
    const { data: listener } = supabase.auth.onAuthStateChange(
      async ( event, session ) => {
        if ( (user && user.user_id !== session?.user?.id
        ) || !user )
        {
          console.log( `User has changed (${event})` )
          setUser( parseResponse( session?.user ) )
        }
      } )
    return () => {
      listener.subscription.unsubscribe()
    }
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
    const userResponse = await service.login( request )
    setUser( userResponse )
  }

  const logout = async ( token?: string ) => {
    await service.logout( token )
    setUser( undefined )
  }

  const register = async ( request: UserRegisterRequest ) => {
    const userResponse = await service.register( request )
    setUser( userResponse )
  }

  const  revalidate = async ( token: string ): Promise<void> => {

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