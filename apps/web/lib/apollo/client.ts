"use client";

import { ApolloClient, HttpLink } from "@apollo/client";
import { makeCache } from "./cache";

let client: ApolloClient | null = null;

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function getApolloClient() {
  if (client) return client;
  client = new ApolloClient({
    link: new HttpLink({
      uri: `${getBaseUrl()}/api/graphql`,
      credentials: "include",
    }),
    cache: makeCache(),
    devtools: { enabled: process.env.NODE_ENV === "development" },
  });
  return client;
}
