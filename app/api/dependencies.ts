"use server"
import OpenAI           from "openai"
import { createClient } from "@supabase/supabase-js"
import prisma           from "@/lib/prisma"
import {
  PrismaNationalIdentityFormatData
}                       from "@/modules/national_identity_format/infrastructure/prisma_national_identity_format_data"
import {
  AddNationalIdentityFormat
}                       from "@/modules/national_identity_format/application/add_national_identity_format"
import {
  RemoveNationalIdentityFormat
}                       from "@/modules/national_identity_format/application/remove_national_identity_format"
import {
  UpdateNationalIdentityFormat
}                       from "@/modules/national_identity_format/application/update_national_identity_format"
import {
  SearchNationalIdentityFormat
}                       from "@/modules/national_identity_format/application/search_national_identity_format"
import {
  PrismaCountryData
}                       from "@/modules/country/infrastructure/persistance/prisma_country_data"
import {
  AddCountry
}                       from "@/modules/country/application/add_country"
import {
  RemoveCountry
}                       from "@/modules/country/application/remove_country"
import {
  UpdateCountry
}                       from "@/modules/country/application/update_country"
import {
  SearchCountry
}                       from "@/modules/country/application/search_country"

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

const countryData = new PrismaCountryData( prisma )

export async function addCountry() {
  return new AddCountry( countryData )
}

export async function removeCountry() {
  return new RemoveCountry( countryData )
}

export async function updateCountry() {
  return new UpdateCountry( countryData )
}

export async function searchCountry() {
  return new SearchCountry( countryData )
}

const identityFormatData = new PrismaNationalIdentityFormatData( prisma )

export async function addNationalIdentity() {
  return new AddNationalIdentityFormat( identityFormatData,
    await searchCountry() )
}

export async function removeNationalIdentity() {
  return new RemoveNationalIdentityFormat( identityFormatData )
}

export async function updateNationalIdentity() {
  return new UpdateNationalIdentityFormat( identityFormatData,
    await searchCountry() )
}

export async function searchNationalIdentityFormat() {
  return new SearchNationalIdentityFormat( identityFormatData )
}
