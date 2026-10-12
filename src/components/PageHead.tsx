import { Fragment, useEffect, useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, rand, RM } from '../lib/motion';
import { useRouter } from '../lib/router';

/** Text split into per-letter spans (words kept together so lines still wrap between words). */
export function Chars({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((w, i, all) => (
        <Fragment key={i}>
          <span className="word" aria-hidden="true">{[...w].map((c, j) => <span key={j} className="ch">{c}</span>)}</span>
          {i < all.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  );
}

type Props = { glyph: string; eyebrow: string; title: string; children?: ReactNode; tone?: string };

/** Page opening: a disc stamps in, the character spins onto it, the title's letters drop into place. */
export function PageHead({ glyph, eyebrow, title, children, tone = 'red' }: Props) {
  const root = useRef<HTMLElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const { revealed } = useRouter();

  useGSAP(() => {
    if (RM) return;
    tl.current = gsap.timeline({ paused: true })
      .fromTo('.ph-disc', { scale: 0 }, { scale: 1, duration: 0.9, ease: 'elastic.out(1,.6)' }, 0)
      .fromTo('.ph-glyph', { scale: 2.6, rotation: -60, autoAlpha: 0 }, { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.45, ease: 'power4.in' }, 0.1)
      .fromTo('.ph-eyebrow', { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out' }, 0.2)
      .fromTo('.ph-title .ch', { y: -110, rotation: () => rand(-35, 35), autoAlpha: 0 }, { y: 0, rotation: 0, autoAlpha: 1, duration: 0.6, stagger: 0.03, ease: 'back.out(2)' }, 0.25)
      .fromTo('.ph-lede', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' }, 0.6);
  }, { scope: root });

  useEffect(() => { if (revealed) tl.current?.play(); }, [revealed]);

  return (
    <header className="ph" ref={root} style={{ ['--tone' as string]: `var(--${tone})` }}>
      <div className="ph-art" aria-hidden="true"><div className="ph-disc" /><div className="ph-glyph">{glyph}</div></div>
      <div className="ph-copy">
        <p className="label ph-eyebrow">{eyebrow}</p>
        <h1 className="ph-title" aria-label={title}><Chars text={title} /></h1>
        {children && <div className="ph-lede">{children}</div>}
      </div>
    </header>
  );
}
