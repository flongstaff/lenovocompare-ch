# React & Next.js Gotchas

- lucide-react `Keyboard` icon shadows `Keyboard` type from `lib/types.ts` — use `as KeyboardIcon` alias; check for similar name collisions with `Monitor`, `Battery`, etc.
- `useSearchParams()` requires a `<Suspense>` boundary wrapping the component
- lucide-react icon `size` prop type is `string | number`, not just `number`
- Footer uses named export (`export const Footer`), Header uses default export
- Home page (`HomeClient.tsx`) uses `mx-auto max-w-7xl px-4 sm:px-6` container — matches header's max-width. Other page clients may need similar wrapping
- `useMemo`/`useCallback` must be called before early returns — wrap in null-safe lambdas (e.g., `useMemo(() => model ? compute(model) : null, [model])`) and include the null case in the guard
- Named export dynamic imports: `dynamic(() => import('...').then(m => ({ default: m.NamedExport })), { ssr: false })`
- CSS `@keyframes` + `animationDelay` style prop replaces `framer-motion` for simple stagger animations without the ~185 KB bundle cost
- Home page precomputes scores via `useMemo` map in HomeClient, passes `precomputedScores` prop to LaptopCard — avoids per-card `getModelScores()` calls
- `useCompare` uses `sessionStorage` (not `localStorage`) — compare selections persist during navigation/refresh within a tab but clear on new tab/session. Don't switch to `localStorage` or plain `useState`
- Cross-page shared React state: `useState` in a hook called from different page components creates independent instances. Use `sessionStorage` with lazy initializer or a context provider in layout for state that must persist across navigation
- URL param parsers that build result objects: only assign non-null values — assigning `null` creates keys that inflate `Object.keys().length` and trigger false-positive state updates
