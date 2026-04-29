import { Environment, Network, RecordSource, Store } from "relay-runtime";
import type { FetchFunction, GraphQLResponse } from "relay-runtime";

const fetchFn: FetchFunction = async (request, variables) => {
  const response = await fetch("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: request.text, variables }),
  });
  return response.json() as Promise<GraphQLResponse>;
};

export const environment = new Environment({
  network: Network.create(fetchFn),
  store: new Store(new RecordSource()),
});
