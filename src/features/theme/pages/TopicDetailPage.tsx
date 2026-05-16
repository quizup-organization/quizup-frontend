import { useParams } from 'react-router-dom'
import { useTopic } from '../api/theme.queries'

export default function TopicDetailPage() {
  const { topicId = '' } = useParams()
  const { data } = useTopic(topicId)

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold">Detail topic</h2>
      <p>ID: {data?.topicId}</p>
      <p>Nom: {data?.name}</p>
      <p>Questions: {data?.questionCount}</p>
    </div>
  )
}

