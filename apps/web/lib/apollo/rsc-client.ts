import "server-only";

import { ApolloClient, HttpLink } from "@apollo/client";
import { makeCache } from "./cache";

// registerApolloClient is not exported by @apollo/client-integration-nextjs@0.14.x;
// use a plain per-request factory instead.
export function getClient() {
  return new ApolloClient({
    cache: makeCache(),
    link: new HttpLink({
      // In RSC, relative URLs don't work — use absolute.
      uri: "http://localhost:3000/api/graphql",
      credentials: "include",
      // Forward cookies for viewer auth in RSC context.
      fetchOptions: { cache: "no-store" },
    }),
  });
}
