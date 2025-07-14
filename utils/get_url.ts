"use server"
import { headers } from "next/headers"

export const getUrl = async ()=>{
  const headersList = await headers();
  const host = headersList.get('host') ?? 'localhost:3000';
  return  process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_APP_URL! : `http://${host}`;
}