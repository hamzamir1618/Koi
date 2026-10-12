import { createContext, useContext } from 'react';
import type React from 'react';

export type View = 'home' | 'menu' | 'dish' | 'story' | 'visit' | 'reserve' | 'confirm';
export const VIEWS: View[] = ['home', 'menu', 'dish', 'story', 'visit', 'reserve', 'confirm'];

export type Transition = 'doors' | 'flood' | 'zoom' | 'unroll' | 'wave' | 'stamp';

// Every destination arrives through its own wipe.
export const TRANSITION: Record<View, Transition> = {
  home: 'doors',     // the temple doors close and open again
  menu: 'flood',     // colour floods out of the click
  dish: 'zoom',      // the dish's character lifts off the menu and becomes the page
  story: 'unroll',   // a hanging scroll unrolls over the page
  visit: 'wave',     // a jade seigaiha wave washes over
  reserve: 'stamp',  // a seal is pressed onto a sheet
  confirm: 'stamp',
};

/** Seal character + English word shown mid-transition. */
export const LABEL: Record<View, [string, string]> = {
  home: ['鲤', 'KOI'], menu: ['菜', 'Menu'], dish: ['味', 'Taste'], story: ['道', 'Story'],
  visit: ['访', 'Visit'], reserve: ['订', 'Reserve'], confirm: ['成', 'Booked'],
};

/** Which nav link is lit for each page. */
export const NAV_OF: Record<View, View> = {
  home: 'home', menu: 'menu', dish: 'menu', story: 'story', visit: 'visit', reserve: 'reserve', confirm: 'reserve',
};

export interface Route { view: View; param?: string }

/** The click (or key press) that started a navigation. `target` lets the dish zoom find the glyph that was chosen. */
export interface Point { clientX: number; clientY: number; target?: EventTarget | null }

interface RouterValue {
  route: Route;
  go: (to: View, from?: Point, param?: string) => void;
  /** True once the opening doors have revealed the page. */
  revealed: boolean;
}

export const RouterContext = createContext<RouterValue>({ route: { view: 'home' }, go: () => {}, revealed: true });
export const useRouter = () => useContext(RouterContext);

export const hashOf = (r: Route) => `#${r.view}${r.param ? `/${r.param}` : ''}`;

export function routeFromHash(): Route {
  const [v, param] = window.location.hash.slice(1).split('/');
  return VIEWS.includes(v as View) ? { view: v as View, param } : { view: 'home' };
}

/** Link props: a real href (so it can be opened in a new tab) that animates when clicked normally. */
export function linkTo(go: RouterValue['go'], view: View, param?: string) {
  return {
    href: hashOf({ view, param }),
    onClick: (e: React.MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      go(view, e, param);
    },
  };
}
