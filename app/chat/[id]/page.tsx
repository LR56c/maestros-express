interface PageProps {
  params: {
    id: string;
  };
}

export default function DirectChat( { params }: PageProps ) {
  const { id } = params

  return <div>id: { id }</div>
}
