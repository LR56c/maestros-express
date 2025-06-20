import { RoleLevel }           from "@/modules/role/domain/role_level"
import { RoleDTO }             from "@/modules/role/application/role_dto"
import {
  BaseException
}                              from "@/modules/shared/domain/exceptions/base_exception"
import {
  getHighterRoleLevel
}                              from "@/modules/shared/utils/get_highter_role_level"

interface RouteControl {
  base: string,
  methods: {
    GET?: RoleLevel;
    POST?: RoleLevel;
    PUT?: RoleLevel;
    DELETE?: RoleLevel;
  };
}

// const auth_control: RouteControl[] = [
//   {
//     base   : "/api/auth/login",
//     methods: {
//       "POST": RoleLevel.ADMIN
//     }
//   },
//   {
//     base   : "/api/auth/register",
//     methods: {
//       "POST": RoleLevel.ADMIN
//     }
//   },
//   {
//     base   : "/api/auth/oauth",
//     methods: {
//       "POST": RoleLevel.ADMIN
//     }
//   },
//   {
//     base   : "/api/auth/logout",
//     methods: {
//       "POST": RoleLevel.USER
//     }
//   },
//   {
//     base   : "/api/auth/confirm",
//     methods: {
//       "POST": RoleLevel.USER
//     }
//   },
//   {
//     base   : "/api/auth",
//     methods: {
//       "DELETE": RoleLevel.ADMIN
//     }
//   }
// ]

// const user_repository_control: RouteControl[] = [
//   {
//     base   : "/api/user_repository",
//     methods: {
//       "POST": RoleLevel.USER,
//       "GET" : RoleLevel.USER,
//       "PUT" : RoleLevel.MOD
//     }
//   }
// ]

// const orquestator_control: RouteControl[] = [
//   {
//     base   : "/api/o/user",
//     methods: {
//       "DELETE": RoleLevel.ADMIN,
//       "PUT"   : RoleLevel.ADMIN
//     }
//   },
//   {
//     base   : "/api/o/user/generate",
//     methods: {
//       "POST": RoleLevel.ADMIN
//     }
//   },
//   {
//     base   : "/api/o/approve",
//     methods: {
//       "PUT": RoleLevel.ADMIN
//     }
//   }
// ]

const access_control: RouteControl[] = [
]

const requiredRouteLevel = ( path: string, method: string ): RoleLevel => {
  const route = access_control.find(
    ( entry ) => path.startsWith( entry.base ) )
  if ( !route ) {
    return RoleLevel.PUBLIC
  }
  const keyMethod     = method as keyof typeof route.methods
  const requiredLevel = route.methods[keyMethod]
  return requiredLevel ?? RoleLevel.PUBLIC
}

const getUserData = ( json: unknown ): {
                                         role: RoleLevel,
                                         user_id: string
                                       } | undefined => {
  const user     = (
    json as { roles: RoleDTO[], user_id: string }
  )
  const userRole = getHighterRoleLevel( user.roles.map( role => role.name ) )
  if ( userRole === undefined ) {
    return undefined
  }
  return {
    role   : userRole,
    user_id: user.user_id
  }
}

const getUser = async ( event: H3Event ) => {
  const session = await getUserSession( event )
  return session.user?.ut ?? undefined
}
export default defineEventHandler( async ( event ) => {
    // event.context.highterRole = "public"

    console.log( "event", event.path )
    const routeLevel = requiredRouteLevel( event.path, event.method )

    const token: string | undefined = getRequestHeader( event, "ut" ) ??
      await getUser( event ) ?? undefined

    const jwt = await verifyJwt( token ?? "" )
    if ( jwt instanceof BaseException ) {
      if ( routeLevel === RoleLevel.PUBLIC ) {
        return
      }
      console.log( "no jwt" )
      throw createError( {
        statusCode   : 401,
        statusMessage: "Bad Request"
      } )
    }
    const user    = getUserData( jwt.payload.user )
    const bAccess = user && user.role >= routeLevel
    if ( !bAccess ) {
      console.log( "no access", user, routeLevel )
      throw createError( {
        statusCode   : 401,
        statusMessage: "Bad Request"
      } )
    }
    // event.context.auth        = user.user_id ?? undefined
    // event.context.highterRole = user ? (
    //   RoleLevel[user.role]
    // ).toLowerCase() : "public"
} )
