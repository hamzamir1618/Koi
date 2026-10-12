import { useLayoutEffect, useRef, useState } from 'react';
import { vars } from '../lib/motion';

const RATIO = 1200 / 637; // source wave art

type Props = { src: string; className: string; dur: number };

/** A strip of wave art drifting sideways forever. Tiles alternate mirrored so the seam never shows. */
export function Waves({ src, className, dur }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [tile, setTile] = useState({ w: 0, n: 0 });

  useLayoutEffect(() => {
    const measure = () => {
      const h = ref.current?.offsetHeight ?? 0;
      if (!h) return;
      const w = h * RATIO;
      setTile({ w, n: 2 * Math.ceil((innerWidth / w + 2) / 2) + 2 });
    };
    measure();
    addEventListener('resize', measure);
    return () => removeEventListener('resize', measure);
  }, []);

  return (
    <div ref={ref} className={`wave-layer ${className}`} aria-hidden="true">
      <div className="wave-strip" style={vars({ '--period': `${2 * tile.w}px`, '--dur': `${dur}s` })}>
        {Array.from({ length: tile.n }, (_, i) => (
          <img key={i} src={src} alt="" className={i % 2 ? 'f' : undefined} style={{ width: tile.w }} />
        ))}
      </div>
    </div>
  );
}
