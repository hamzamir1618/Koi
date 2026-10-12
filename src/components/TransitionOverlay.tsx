import { forwardRef, useImperativeHandle, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, slam } from '../lib/motion';
import { LABEL, type Point, type Transition, type View } from '../lib/router';

export interface OverlayHandle {
  /** Covers the screen. Resolves with the transition actually used (zoom falls back to flood without a glyph). */
  cover: (kind: Transition, to: View, from?: Point) => Promise<Transition>;
  uncover: (kind: Transition) => Promise<void>;
}

const STUDS = Array.from({ length: 35 }, (_, i) => <i key={i} />);
const SCALLOPS = Array.from({ length: 14 }, (_, i) => <i key={i} />);

/**
 * Full-screen wipes between pages, all flat colour:
 * doors   the temple doors slide shut, a seal is pressed on the seam, they swing open on the new page
 * flood   a disc of lacquer red floods out of the click, then drains to the bottom
 * zoom    the dish's character lifts off the menu row, grows to the middle, and lands in its spot on the dish page
 * unroll  a paper scroll unrolls down the screen behind its rod, then rolls back up
 * wave    a jade seigaiha wave rises over everything and keeps going
 * stamp   a sheet slides up and a big seal is pressed onto it; the sheet is lifted away
 */
export const TransitionOverlay = forwardRef<OverlayHandle>(function TransitionOverlay(_, ref) {
  const root = useRef<HTMLDivElement>(null);
  const flyer = useRef<HTMLElement | null>(null);

  // The overlay owns its animations so a wipe started from a page's callback doesn't die when that page unmounts.
  const { contextSafe } = useGSAP(() => {
    gsap.set('.tx-door-l', { xPercent: -101 });
    gsap.set('.tx-door-r', { xPercent: 101 });
    gsap.set('.tx-flood', { clipPath: 'circle(0% at 50% 50%)' });
    gsap.set('.tx-scroll', { clipPath: 'inset(0% 0% 100% 0%)' });
    gsap.set('.tx-wave', { yPercent: 115 });
    gsap.set('.tx-sheet', { yPercent: 110 });
    gsap.set('.tx-zoom', { autoAlpha: 0 });
    gsap.set('.tx-label', { autoAlpha: 0 });
  }, { scope: root });

  const q = (s: string) => root.current!.querySelector<HTMLElement>(s)!;

  const labelIn = (to: View, dark = false) => {
    const l = q('.tx-label');
    l.classList.toggle('dark', dark);
    l.querySelector('.seal')!.textContent = LABEL[to][0];
    l.querySelector('b')!.textContent = LABEL[to][1];
    return gsap.timeline()
      .set(l, { autoAlpha: 1 })
      .add(slam(l.querySelector('.seal'), { rot: -24, to: -6 }))
      .fromTo(l.querySelector('b'), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, ease: 'power3.out' }, '-=.3');
  };
  const labelOut = () => gsap.to(q('.tx-label'), { autoAlpha: 0, scale: 1.3, duration: 0.25, ease: 'power2.in', onComplete: () => { gsap.set(q('.tx-label'), { scale: 1 }); } });

  useImperativeHandle(ref, () => {
    const api: OverlayHandle = {
      async cover(kind, to, from) {
        const tl = gsap.timeline();
        let used: Transition = kind;

        if (kind === 'zoom') {
          const host = (from?.target as Element | null | undefined)?.closest?.('[data-dish]');
          const src = host?.querySelector<HTMLElement>('.zoom-src');
          if (!src) used = 'flood';
          else {
            const r = src.getBoundingClientRect();
            const f = src.cloneNode(true) as HTMLElement;
            f.className = 'zoom-flyer';
            f.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;font-size:${getComputedStyle(src).fontSize};color:${getComputedStyle(src).color}`;
            document.body.appendChild(f);
            flyer.current = f;
            gsap.set(src, { autoAlpha: 0 });
            const sheet = q('.tx-zoom');
            sheet.style.background = getComputedStyle(host!).getPropertyValue('--bg') || 'var(--ink)';
            const size = Math.min(innerWidth, innerHeight) * 0.6;
            tl.to(sheet, { autoAlpha: 1, duration: 0.35, ease: 'power1.out' }, 0)
              .to(f, { left: innerWidth / 2 - size / 2, top: innerHeight / 2 - size / 2, width: size, height: size, fontSize: size * 0.82, rotation: -8, duration: 0.7, ease: 'power3.inOut' }, 0)
              .to(f, { rotation: 0, duration: 0.3, ease: 'back.out(3)' });
            await tl.then(() => undefined);
            return used;
          }
        }

        if (used === 'doors') {
          tl.set('.tx-doors', { autoAlpha: 1 })
            .set('.tx-door-l,.tx-door-r', { rotationY: 0 })
            .to('.tx-door-l', { xPercent: 0, duration: 0.55, ease: 'power3.in' }, 0)
            .to('.tx-door-r', { xPercent: 0, duration: 0.55, ease: 'power3.in' }, 0)
            .fromTo('.tx-doors-in', { x: -10 }, { x: 0, duration: 0.5, ease: 'elastic.out(1,.25)' })
            .add(labelIn(to), '-=.45');
        } else if (used === 'flood') {
          const x = from?.clientX ?? innerWidth / 2, y = from?.clientY ?? innerHeight / 2;
          tl.fromTo('.tx-flood', { clipPath: `circle(0% at ${x}px ${y}px)` }, { clipPath: `circle(150% at ${x}px ${y}px)`, duration: 0.6, ease: 'power3.in' })
            .add(labelIn(to), '-=.1');
        } else if (used === 'unroll') {
          tl.set('.tx-rod', { y: 0, autoAlpha: 1 })
            .to('.tx-scroll', { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'power2.inOut' }, 0)
            .to('.tx-rod', { y: () => innerHeight, duration: 0.75, ease: 'power2.inOut' }, 0)
            .add(labelIn(to, true), '-=.2');
        } else if (used === 'wave') {
          tl.fromTo('.tx-wave', { yPercent: 115 }, { yPercent: 0, duration: 0.7, ease: 'power2.inOut' })
            .add(labelIn(to), '-=.15');
        } else if (used === 'stamp') {
          const st = q('.tx-stamp');
          st.textContent = LABEL[to][0];
          tl.fromTo('.tx-sheet', { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: 'power3.in' })
            .add(slam(st, { from: 3.6, rot: -40, to: -8 }))
            .fromTo('.tx-sheet', { x: -14 }, { x: 0, duration: 0.6, ease: 'elastic.out(1,.2)' }, '-=.55')
            .to({}, { duration: 0.15 });
          await tl.then(() => undefined);
          return used;
        }
        tl.to({}, { duration: 0.2 });
        await tl.then(() => undefined);
        return used;
      },

      async uncover(kind) {
        const tl = gsap.timeline();
        if (kind === 'zoom') {
          const f = flyer.current;
          const target = document.querySelector<HTMLElement>('.zoom-dest');
          if (f && target) {
            const t = target.getBoundingClientRect();
            tl.to(f, { left: t.left, top: t.top, width: t.width, height: t.height, fontSize: getComputedStyle(target).fontSize, color: getComputedStyle(target).color, duration: 0.7, ease: 'power3.inOut' }, 0)
              .to('.tx-zoom', { autoAlpha: 0, duration: 0.5, ease: 'power1.in' }, 0.2)
              .add(() => { gsap.set(target, { autoAlpha: 1 }); f.remove(); });
          } else {
            f?.remove();
            if (target) gsap.set(target, { autoAlpha: 1 });
            tl.to('.tx-zoom', { autoAlpha: 0, duration: 0.4 });
          }
          flyer.current = null;
          await tl.then(() => undefined);
          return;
        }
        if (kind === 'stamp') {
          tl.to('.tx-sheet', { yPercent: -115, duration: 0.7, ease: 'power3.inOut' }).set('.tx-sheet', { yPercent: 110 });
          await tl.then(() => undefined);
          return;
        }
        tl.add(labelOut());
        if (kind === 'doors') {
          tl.to('.tx-door-l', { rotationY: 100, duration: 1.1, ease: 'power3.inOut' }, '-=.05')
            .to('.tx-door-r', { rotationY: -100, duration: 1.1, ease: 'power3.inOut' }, '<')
            .to('.tx-doors', { autoAlpha: 0, duration: 0.3 }, '-=.35')
            .set('.tx-door-l', { xPercent: -101, rotationY: 0 })
            .set('.tx-door-r', { xPercent: 101, rotationY: 0 });
        } else if (kind === 'flood') {
          tl.to('.tx-flood', { clipPath: 'circle(0% at 50% 120%)', duration: 0.6, ease: 'power3.out' }, '-=.1');
        } else if (kind === 'unroll') {
          tl.to('.tx-scroll', { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.7, ease: 'power2.inOut' }, '-=.1')
            .to('.tx-rod', { y: 0, duration: 0.7, ease: 'power2.inOut' }, '<')
            .set('.tx-rod', { autoAlpha: 0 });
        } else if (kind === 'wave') {
          tl.to('.tx-wave', { yPercent: -120, duration: 0.75, ease: 'power2.in' }, '-=.1').set('.tx-wave', { yPercent: 115 });
        }
        await tl.then(() => undefined);
      },
    };
    return { cover: contextSafe(api.cover), uncover: contextSafe(api.uncover) };
  });

  return (
    <div className="tx" ref={root} aria-hidden="true">
      <div className="tx-doors">
        <div className="tx-doors-in">
          <div className="door tx-door-l"><div className="studs">{STUDS}</div><div className="knocker" /></div>
          <div className="door tx-door-r"><div className="studs">{STUDS}</div><div className="knocker" /></div>
        </div>
      </div>
      <div className="tx-flood" />
      <div className="tx-scroll" />
      <div className="rod tx-rod" />
      <div className="tx-wave"><div className="scal b">{SCALLOPS}</div><div className="scal f">{SCALLOPS}</div></div>
      <div className="tx-zoom" />
      <div className="tx-sheet"><span className="seal tx-stamp">订</span></div>
      <div className="tx-label"><span className="seal">菜</span><b>Menu</b></div>
    </div>
  );
});
