import { PrismaUserData } from "@/modules/user/infrastructure/prisma_user_data"
import prisma             from "@/lib/prisma"
import {
  AddUser
}                         from "@/modules/user/application/user_use_cases/add_user"
import {
  SearchUser
}                         from "@/modules/user/application/user_use_cases/search_user"
import {
  SupabaseAdminUserData
} from "@/modules/user/infrastructure/supabase_admin_user_data"
import { createClient } from "@/utils/supabase/server"
import { GetAuth } from "@/modules/user/application/auth_use_cases/get_auth"
import {
  RegisterAuth
}                         from "@/modules/user/application/auth_use_cases/register_auth"

const userDao = new PrismaUserData(prisma)
const authDao  = new SupabaseAdminUserData( await createClient() )
export async function addUser(){
  return new AddUser(userDao, await getUser())
}
export async function registerAuth(){
  return new RegisterAuth( authDao, await addUser() )
}

export async function getUser(){
  return new GetAuth( authDao )
}
export async function searchUser(){
  return new SearchUser(userDao)
}