"use client";

import { ApolloClient, HttpLink, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { makeCache } from "./cache";

let client: ApolloClient | null = null;

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function getApolloClient() {
  if (client) return client;

  const httpLink = new HttpLink({
    uri: `${getBaseUrl()}/api/graphql`,
    credentials: "include",
  });

  // graphql-ws WebSocket link for subscriptions.
  // Yoga supports graphql-ws out of the box on the same endpoint.
  const wsLink =
    typeof window !== "undefined"
      ? new GraphQLWsLink(
          createClient({
            url: `${getBaseUrl()}/api/graphql`.replace(/^http/, "ws"),
          }),
        )
      : null;

  const splitLink = wsLink
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return def.kind === "OperationDefinition" && def.operation === "subscription";
        },
        wsLink,
        httpLink,
      )
    : httpLink;

  client = new ApolloClient({
    link: splitLink,
    cache: makeCache(),
    devtools: { enabled: process.env.NODE_ENV === "development" },
  });
  return client;
}
