import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter/wght.css';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import './index.css';
import Portfolio from './portfolio/portfolio';

createRoot(document.getElementById('root')!).render(<Portfolio />);
