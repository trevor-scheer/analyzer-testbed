import { setupWorker } from "msw/browser";
import { handlers } from "@analyzer-testbed/example-mocks";

export const worker = setupWorker(...handlers);

export async function startMocks(): Promise<void> {
  await worker.start({ onUnhandledRequest: "bypass" });
}
