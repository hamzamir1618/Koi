import { Hero } from '../sections/Hero';
import { Tide } from '../sections/Tide';
import { Upstream } from '../sections/Upstream';
import { Gate } from '../sections/Gate';
import { Menu } from '../sections/Menu';
import { Tapes } from '../sections/Tapes';
import { Evening } from '../sections/Evening';
import { Reserve } from '../sections/Reserve';
import { Rail } from '../components/Rail';

// Section order matters: pinned sections create their ScrollTriggers in mount order, top to bottom,
// and the Rail measures section positions, so it must mount after all of them.
export function Home() {
  return (
    <>
      <Hero />
      <Tide />
      <Upstream />
      <Gate />
      <Menu />
      <Tapes />
      <Evening />
      <Reserve />
      <Rail />
    </>
  );
}
