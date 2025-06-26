// import { NextRequest, NextResponse } from "next/server"
// import {
//   StoryDTO
// }                                    from "@/modules/story/application/story_dto"
// import {
//   AddStory
// }                                    from "@/modules/story/application/add_story"
// import {
//   PrismaStoryData
// }                                    from "@/modules/story/infrastructure/persistance/prisma_story_data"
// import prisma                        from "@/lib/prisma"
// import {
//   StoryDocumentDTO
// }                                    from "@/modules/story/modules/story_document/application/story_document_dto"
//
// let products = [
//   { id: 1, name: "Laptop", price: 1200 },
//   { id: 2, name: "Mouse", price: 25 }
// ]
//
// export async function GET( request: NextRequest ) {
//   const { searchParams } = new URL( request.url )
//   const id               = searchParams.get( "id" )
//
//   if ( id ) {
//     const product = products.find( p => p.id === parseInt( id ) )
//     if ( product ) {
//       return NextResponse.json( product, { status: 200 } )
//     }
//     else {
//       return NextResponse.json( { message: "Producto no encontrado" },
//         { status: 404 } )
//     }
//   }
//   else {
//     return NextResponse.json( products, { status: 200 } )
//   }
// }
//
// export async function POST( request: NextRequest ) {
//   const body            = await request.json()
//   const story: StoryDTO = {
//     id         : body.id,
//     name       : body.name,
//     description: body.description,
//     documents  : body.documents.map( ( doc: any ): StoryDocumentDTO => (
//       {
//         id  : doc.id,
//         url : doc.url,
//         type: doc.type
//       }
//     ) )
//   }
//
//   const add    = new AddStory( new PrismaStoryData( prisma ) )
//   const result = await add.execute( body.worker_id, story )
//   return NextResponse.json( { status: 201 } )
// }
//
// export async function PUT( request: NextRequest ) {
//   const { searchParams } = new URL( request.url )
//   const id               = searchParams.get( "id" )
//
//   if ( !id ) {
//     return NextResponse.json(
//       { message: "ID de producto requerido para actualizar" },
//       { status: 400 } )
//   }
//
//   const body         = await request.json()
//   const productIndex = products.findIndex( p => p.id === parseInt( id ) )
//
//   if ( productIndex !== -1 ) {
//     products[productIndex] = { ...products[productIndex], ...body }
//     return NextResponse.json( products[productIndex], { status: 200 } )
//   }
//   else {
//     return NextResponse.json(
//       { message: "Producto no encontrado para actualizar" }, { status: 404 } )
//   }
// }
//
// export async function DELETE( request: NextRequest ) {
//   const { searchParams } = new URL( request.url )
//   const id               = searchParams.get( "id" )
//
//   if ( !id ) {
//     return NextResponse.json(
//       { message: "ID de producto requerido para eliminar" }, { status: 400 } )
//   }
//
//   const initialLength = products.length
//   products            = products.filter( p => p.id !== parseInt( id ) )
//
//   if ( products.length < initialLength ) {
//     return NextResponse.json( { message: "Producto eliminado correctamente" },
//       { status: 200 } )
//   }
//   else {
//     return NextResponse.json(
//       { message: "Producto no encontrado para eliminar" }, { status: 404 } )
//   }
// }