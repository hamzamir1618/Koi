import { linkTo, NAV_OF, useRouter, type View } from '../lib/router';
import { Seal } from './Seal';

const LINKS: { view: View; zh: string; name: string }[] = [
  { view: 'menu', zh: '菜', name: 'Menu' },
  { view: 'story', zh: '道', name: 'Story' },
  { view: 'visit', zh: '访', name: 'Visit' },
];

export function Nav() {
  const { route, go } = useRouter();
  const lit = NAV_OF[route.view];
  return (
    <header className="nav">
      <a className="logo" {...linkTo(go, 'home')} aria-label="KOI home">
        <Seal>鲤</Seal><b>KOI</b>
      </a>
      <nav className="nav-links" aria-label="Pages">
        {LINKS.map(l => (
          <a key={l.view} className={lit === l.view ? 'on' : undefined} aria-current={lit === l.view ? 'page' : undefined} {...linkTo(go, l.view)}>
            <span className="zh" aria-hidden="true">{l.zh}</span><span className="nl">{l.name}</span>
          </a>
        ))}
      </nav>
      <a className="btn btn-gold mag" {...linkTo(go, 'reserve')}>
        <span className="zh" aria-hidden="true">订</span>Reserve
      </a>
    </header>
  );
}
