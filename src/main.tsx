import { createRoot } from 'react-dom/client';
import App from './App';
import { exposeForTesting, startSmoothScroll } from './lib/scroll';
import { trackVelocity } from './lib/motion';
import './styles/tokens.css';
import './styles/app.css';
import './styles/pages.css';

startSmoothScroll();
trackVelocity();
exposeForTesting();

// No StrictMode: its double-mounted effects would replay the one-shot GSAP choreography (doors, stamps).
createRoot(document.getElementById('root')!).render(<App />);
