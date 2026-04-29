import { handlers } from "@analyzer-testbed/example-mocks";

// MSW runs in browser only — no-op during SSR/prerender
export async function init(): Promise<void> {
  if (typeof window !== "undefined") {
    const { setupWorker } = await import("msw/browser");
    const worker = setupWorker(...handlers);
    await worker.start({ onUnhandledRequest: "bypass" });
  }
}
