
export default async function DirectChat({params}) {
  const { id } = await params
  return <div>
    id: {id}
  </div>
}