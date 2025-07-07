"use server"
import OpenAI           from "openai"
import { createClient } from "@supabase/supabase-js"

export async function supabase() {
  return createClient(
    process.env.SUPABASE_URL ?? "",
    process.env.SUPABASE_ANON_KEY ?? "" )
}

export async function ai() {
  return new OpenAI( {
    apiKey : process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_API_BASE_URL
  } )
}