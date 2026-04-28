"use client";

import { ApolloProvider } from "@apollo/client/react";
import { getApolloClient } from "./client";

export function AppApolloProvider({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={getApolloClient()}>{children}</ApolloProvider>;
}
