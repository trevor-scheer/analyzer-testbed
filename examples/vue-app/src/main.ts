import { createApp, defineComponent, h } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import { setupWorker } from "msw/browser";
import { handlers } from "@analyzer-testbed/example-mocks";
import { apolloClient } from "./apollo.js";
import App from "./App.vue";

const worker = setupWorker(...handlers);

worker.start({ onUnhandledRequest: "bypass" }).then(() => {
  const app = createApp(
    defineComponent({
      setup() {
        return () => h(App);
      },
    }),
  );

  app.provide(DefaultApolloClient, apolloClient);
  app.mount("#app");
});
