import { createAuthClient }          from "better-auth/react"
import { adminClient, anonymousClient }               from "better-auth/client/plugins"
import { ac, admin, client, worker } from "./permissions"

export const authClient = createAuthClient( {
  plugins: [
    anonymousClient(),
    adminClient( {
      ac,
      roles: {
        admin,
        worker,
        client
      }
    } )
  ]
} )

export const hasWorker = await authClient.admin.hasPermission( {
  permissions: {
    worker: ["control"]
  }
} )

export const checkWorker = authClient.admin.checkRolePermission( {
  permissions: {
    worker: ["control"]
  },
  role       : "worker"
} )

export const hasClient = await authClient.admin.hasPermission( {
  permissions: {
    client: ["control"]
  }
} )

export const checkClient = authClient.admin.checkRolePermission( {
  permissions: {
    client: ["control"]
  },
  role       : "client"
} )

export const hasAdmin   = await authClient.admin.hasPermission( {
  permissions: {
    worker: ["control"],
    client: ["control"]
  }
} )

export const checkAdmin = authClient.admin.checkRolePermission( {
  permissions: {
    worker: ["control"],
    client: ["control"]
  },
  role       : "admin"
} )

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;