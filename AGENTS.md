# AGENTS.md — quizup-frontend

> **Frontend** React 19 + TypeScript, Vite 8, Tailwind 4, shadcn/ui. Hors périmètre de
> l'architecture hexagonale Java. Pour les patterns backend : [
`../../best-practices/hexagonal-architecture.md`](../../best-practices/hexagonal-architecture.md).

---

## 1. Rôle

Application frontend de QuizUp : découverte de topics, création/modération de questions, parties
de quiz (bot/lobby), matchmaking, défis, amis. **Tous** les appels HTTP passent par le **gateway API**
(`quizup-gateway`).

**Stack** : React 19, TypeScript, Vite 8, Tailwind 4 (plugin vite), shadcn/ui (style `base-nova`),
TanStack Query v5, Zustand 5, react-router-dom 7, react-oidc-context (OIDC), STOMP over SockJS,
axios, zod, react-hook-form, sonner.

---

## 2. Structure `src/`

```
src/
├── app/                 ← bootstrap (App.tsx), providers.tsx, router.tsx (lazy), layouts/
├── features/            ← vertical slices par domaine
│   ├── auth/            ← OIDC (oidc.config.ts, ProtectedRoute, AuthCallbackPage, use-auth-sync)
│   ├── game/            ← partie de quiz
│   ├── identity/        ← utilisateurs
│   ├── matchmaking/     ← lobbies
│   ├── social/          ← amis + défis (challenges)
│   └── theme/           ← topics + questions (+ schemas/ zod)
├── shared/
│   ├── api/             ← axios-instance.ts, query-client.ts
│   ├── hooks/           ← use-debounce.ts
│   ├── stores/          ← create-pagination-search-store.ts, notification.store.ts
│   ├── types/           ← error.types.ts (RFC 7807), pagination.types.ts
│   ├── ui/              ← ConfirmDialog, DataTable, EmptyState, ErrorBoundary, PageLoader, PaginationControls, SearchInput
│   └── websocket/       ← stomp-client.ts, use-stomp-subscription.ts
├── components/ui/       ← shadcn/ui (15 composants)
└── lib/                 ← utils.ts (cn = clsx+tailwind-merge)
```

**Conventions** : alias Vite `@` → `src` (voir `vite.config.ts`), shadcn/ui via `components.json`
(style `base-nova`), Tailwind 4 dans `src/index.css`.

---

## 3. Client API

- **Wrapper unique** : `src/shared/api/axios-instance.ts` —
  `baseURL = import.meta.env.VITE_API_GATEWAY_BASE_URL ?? '/api'`, header JSON.
- **Auth Bearer** : `setAuthToken(token|null)` set `Authorization: Bearer <token>`. Appelé par
  `features/auth/hooks/use-auth-sync.ts` (écoute `user.access_token` de `useAuth()` OIDC).
- **TanStack Query** : `src/shared/api/query-client.ts` — staleTime 2 min, gcTime 10 min,
  `refetchOnWindowFocus:false`, retry 0 sur mutations, queries max 2 retries **sauf** HTTP
  401/403/404.

**Pattern** : chaque feature a `api/*.api.ts` avec `const X_API_BASE = '/<service>/api'` et des
fonctions typées `axiosInstance.<verb><T>(path, body?).then(r => r.data)`. Les `*.queries.ts`
re-wrapper ces fonctions en React Query (queryKey/invalidation).

---

## 4. Endpoints appelés par feature

| Feature         | Préfixe                    | Endpoints                                                                                                                                                                                                                                                                            |
|-----------------|----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **auth**        | (OIDC)                     | authority `VITE_OIDC_BASE_URL`, client `VITE_OIDC_CLIENT_ID`, redirect `{origin}/auth/callback`                                                                                                                                                                                      |
| **game**        | `/game-service/api`        | POST `/games`, GET `/games/{id}`, GET `/games/{id}/notifications`, POST `/games/{id}/join`, POST `/games/{id}/answer`, POST `/games/search`                                                                                                                                          |
| **identity**    | `/identity-service/api`    | GET `/users/{id}`, POST `/users/search`, GET `/authentication/me`                                                                                                                                                                                                                    |
| **matchmaking** | `/matchmaking-service/api` | POST `/lobbies/search`, POST `/lobbies`, GET `/lobbies/{id}`, GET `/lobbies/{id}/notifications`, POST `/lobbies/{id}/join`, DELETE `/lobbies/{id}`                                                                                                                                   |
| **social**      | `/social-service/api`      | POST `/friend-requests`, POST `/friend-requests/search`, POST `/friend-requests/{id}/accept\|reject\|cancel`, POST `/friendships/search`, DELETE `/friendships/{id}`, POST `/challenges`, GET `/challenges/{id}`, POST `/challenges/search`, POST `/challenges/{id}/accept\|decline` |
| **theme**       | `/theme-service/api`       | POST `/topics/search`, GET `/topics/{id}`, POST `/topics`, POST `/topics/{id}/publish`, POST `/questions/search`, GET `/questions/{id}`, POST `/questions`, POST `/questions/{id}/approve\|reject`                                                                                   |

---

## 5. WebSocket (STOMP over SockJS)

- **Client** : `@stomp/stompjs` v7 + `SockJS` — endpoint **`/ws`** (au travers du gateway,
  proxyé `localhost:8080` en dev). Token dans `connectHeaders: { Authorization: 'Bearer <token>' }`.
  Singleton, reconnectDelay 5 s, heartbeats in/out 4 s.
- **Hook** : `use-stomp-subscription({destination, onMessage, enabled})` — JSON.parse, cleanup.
- **Destinations** (brokered `/topic/...`) :
    - `/topic/social/{userId}` (amis, demandes d'amitié, amitiés)
    - `/topic/games/{gameId}` (parties)
    - `/topic/lobbies/{lobbyId}` (matchmaking)

---

## 6. Configuration (env)

Pas de `.env`/`.env.example` dans le repo — variables référencées en code :

- `VITE_API_GATEWAY_BASE_URL` — baseURL axios + préfixe SockJS (fallback `/api`)
- `VITE_OIDC_BASE_URL` — authority OIDC
- `VITE_OIDC_CLIENT_ID` — client OIDC

**Vite dev** : port `3000`, proxy `/api` → `localhost:8080`, `/ws` → `localhost:8080` (ws:true).
