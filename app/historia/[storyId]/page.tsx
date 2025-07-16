interface PageProps {
  params: Promise<{ storyId: string }>
}

export default async function Historia( { params }: PageProps ) {
  const { storyId } = await params
  return (
    <div>historia {storyId}</div>
  )
}