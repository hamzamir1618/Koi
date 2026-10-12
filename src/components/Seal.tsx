import { forwardRef, type CSSProperties, type ReactNode } from 'react';

type Props = { children: ReactNode; className?: string; style?: CSSProperties; label?: string };

/** A red chop (印章): flat square, double inner frame, heavy serif character. Size and colours via --s, --sbg, --sfg. */
export const Seal = forwardRef<HTMLSpanElement, Props>(({ children, className = '', style, label }, ref) => (
  <span ref={ref} className={`seal ${className}`} style={style} aria-label={label} aria-hidden={label ? undefined : true}>
    {children}
  </span>
));
Seal.displayName = 'Seal';
