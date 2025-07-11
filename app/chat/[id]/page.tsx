interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DirectChat( { params }: PageProps ) {
  const { id } = await params

  return <div>id: { id }</div>
}
