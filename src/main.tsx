import { createRoot } from 'react-dom/client';
import App from '@/App';
import { Providers } from '@/app/providers';

import '@/styles/styles.css';
import '@/styles/pages.css';
import '@/styles/memo.css';
import '@/styles/subs.css';
import '@/styles/image-tools.css';
import '@/styles/txns.css';
import '@/styles/salary.css';
import '@/styles/loan-search.css';
import '@/styles/flows.css';
import '@/styles/flows-extra.css';
import '@/styles/mobile.css';
import '@/styles/mobile-app.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('#root element not found');
createRoot(rootElement).render(
  <Providers>
    <App />
  </Providers>,
);
