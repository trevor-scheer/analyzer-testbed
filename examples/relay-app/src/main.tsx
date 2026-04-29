import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RelayEnvironmentProvider } from "react-relay";
import { environment } from "./environment.js";
import { startMocks } from "./mocks.js";
import App from "./App.js";

const root = document.getElementById("root");
if (!root) throw new Error("No #root element");

startMocks().then(() => {
  createRoot(root).render(
    <React.StrictMode>
      <RelayEnvironmentProvider environment={environment}>
        <Suspense fallback={<p>Loading…</p>}>
          <App />
        </Suspense>
      </RelayEnvironmentProvider>
    </React.StrictMode>,
  );
});
