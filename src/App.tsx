import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { RM, ScrollTrigger } from './lib/motion';
import { scrollTop } from './lib/scroll';
import { hashOf, RouterContext, routeFromHash, TRANSITION, type Point, type Route, type View } from './lib/router';
import { BookingProvider } from './lib/booking';
import { Doors } from './components/Doors';
import { Nav } from './components/Nav';
import { Cursor } from './components/Cursor';
import { TransitionOverlay, type OverlayHandle } from './components/TransitionOverlay';
import { Footer } from './sections/Footer';
import { Home } from './pages/Home';
import { MenuPage } from './pages/MenuPage';
import { DishPage } from './pages/DishPage';
import { StoryPage } from './pages/StoryPage';
import { VisitPage } from './pages/VisitPage';
import { ReservePage } from './pages/ReservePage';
import { ConfirmPage } from './pages/ConfirmPage';

const PAGES: Record<View, () => JSX.Element> = {
  home: Home, menu: MenuPage, dish: DishPage, story: StoryPage, visit: VisitPage, reserve: ReservePage, confirm: ConfirmPage,
};

// Never let a wipe that fails to finish lock up navigation.
const atMost = <T,>(p: Promise<T>, fallback: T, ms = 4000) => Promise.race([p, new Promise<T>(r => setTimeout(() => r(fallback), ms))]);
const same = (a: Route, b: Route) => a.view === b.view && (a.param ?? '') === (b.param ?? '');

export default function App() {
  const [route, setRoute] = useState<Route>(routeFromHash);
  const [doors, setDoors] = useState(!RM);
  const [revealed, setRevealed] = useState(RM);
  const overlay = useRef<OverlayHandle>(null);
  const current = useRef(route);
  const busy = useRef(false);

  const swap = useCallback((to: Route) => {
    // commit the new page synchronously while the screen is covered, then re-measure scroll triggers
    flushSync(() => setRoute(to));
    current.current = to;
    scrollTop();
    ScrollTrigger.refresh();
  }, []);

  const go = useCallback(async (view: View, from?: Point, param?: string) => {
    const to: Route = { view, param };
    if (busy.current) return;
    if (same(to, current.current)) { scrollTop(true); return; }
    busy.current = true;
    try { history.pushState(null, '', hashOf(to)); } catch { /* sandboxed frames may refuse */ }
    try {
      if (RM || !overlay.current) { swap(to); return; }
      const used = await atMost(overlay.current.cover(TRANSITION[view], view, from), TRANSITION[view]);
      swap(to);
      await atMost(overlay.current.uncover(used), undefined);
    } finally {
      busy.current = false;
    }
  }, [swap]);

  // browser back/forward
  useEffect(() => {
    const onPop = () => { const r = routeFromHash(); if (!same(r, current.current)) go(r.view, undefined, r.param); };
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, [go]);

  // late fonts and images shift layout; re-measure once everything is in
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    addEventListener('load', refresh);
    document.fonts?.ready.then(refresh);
    return () => removeEventListener('load', refresh);
  }, []);

  const router = useMemo(() => ({ route, go, revealed }), [route, go, revealed]);
  const Page = PAGES[route.view];

  return (
    <RouterContext.Provider value={router}>
      <BookingProvider>
        {doors && <Doors onReveal={() => setRevealed(true)} onDone={() => setDoors(false)} />}
        <Nav />
        <main key={hashOf(route)} className={`page page-${route.view}`}>
          <Page />
        </main>
        <Footer />
        <TransitionOverlay ref={overlay} />
        <Cursor />
      </BookingProvider>
    </RouterContext.Provider>
  );
}
