import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

import { releasePrerendered } from "./lib/prerender";

const root = document.getElementById("root")!;

createRoot(root).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
);

// Only does anything on a prerendered page (src/lib/prerender.ts).
releasePrerendered(root);
