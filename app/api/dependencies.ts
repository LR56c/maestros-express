"use server"
import OpenAI           from "openai"
import { createClient } from "@supabase/supabase-js"
export const supabase = async () => await createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_ANON_KEY ?? "" )
export const ai = async () => new OpenAI( {
  apiKey : process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL
} )
