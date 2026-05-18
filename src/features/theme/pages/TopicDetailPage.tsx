import { useParams } from 'react-router-dom'
import { useTopic } from '../api/theme.queries'

const TOPIC_ICON: Record<string, string> = {
  MOVIES: '🎬',
  SPORTS: '⚽',
  SCIENCE: '🔬',
  HISTORY: '🏛️',
  MUSIC: '🎵',
  TECHNOLOGY: '💻',
  GENERAL: '🧠',
}

export default function TopicDetailPage() {
  const { topicId = '' } = useParams()
  const { data } = useTopic(topicId)
  const icon = TOPIC_ICON[data?.category ?? 'GENERAL'] ?? '🎯'

  return (
    <div className="mx-auto w-full max-w-[375px] overflow-hidden rounded-[28px] border border-zinc-800 bg-black text-white shadow-2xl">
      <div className="flex items-center gap-2 bg-red-600 px-4 pb-3 pt-4">
        <span className="text-xl">✏️</span>
        <p className="flex-1 truncate text-lg font-black">{data?.name ?? 'Categorie'}</p>
        <div className="flex gap-3 text-lg">
          <span>🔍</span>
          <span>💬</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex gap-3">
          <div className="flex size-[88px] items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-4xl">{icon}</div>
          <div className="flex flex-1 flex-col gap-2">
            <button type="button" className="rounded-xl bg-red-600 px-4 py-2 text-left text-sm font-extrabold">
              ⚡ Jouer
            </button>
            <button type="button" className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-left text-sm font-bold text-zinc-400">
              ⊖ Ne plus suivre
            </button>
            <button type="button" className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-left text-sm font-bold text-violet-400">
              🏆 Classements
            </button>
          </div>
        </div>

        <p className="mt-4 text-lg font-black">{data?.name}</p>
        <p className="text-sm text-zinc-500">{data?.description || 'Pret pour un duel ?'}</p>

        <div className="mt-4 border-t border-zinc-900 pt-4">
          <p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-zinc-500">Questions completees</p>
          <div className="h-7 overflow-hidden rounded-lg bg-zinc-900">
            <div className="flex h-full w-[30%] items-center bg-zinc-800 pl-3 text-xs font-bold text-zinc-400">30%</div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 divide-x divide-zinc-900 rounded-xl border border-zinc-900 bg-zinc-950 p-3 text-center">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-zinc-500">Votre niveau</p>
            <p className="text-2xl font-black">1</p>
          </div>
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-zinc-500">Abonnes</p>
            <p className="text-2xl font-black">5 972</p>
          </div>
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-zinc-500">Titre suivant</p>
            <p className="text-sm font-black">Niv. 10</p>
            <p className="text-xs text-zinc-500">Depute</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 items-end border-t border-zinc-900 bg-zinc-950 px-2 pb-2 pt-3 text-center text-[10px] font-bold text-zinc-500">
        <div>🏠<div>Accueil</div></div>
        <div>👥<div>Personnes</div></div>
        <div className="-mt-5">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-600 text-xl text-white">⚡</div>
        </div>
        <div>⊞<div>Themes</div></div>
        <div className="text-red-500">🔔<div>Activite</div></div>
      </div>
    </div>
  )
}

