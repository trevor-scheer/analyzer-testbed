import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("https://countries.trevorblades.com");

// This query is validated by the analyzer against the introspected schema.
// It intentionally uses real field names from the countries.trevorblades.com API.
const COUNTRIES_QUERY = gql`
  query CountryList {
    countries {
      code
      name
      emoji
      continent {
        name
      }
      languages {
        name
        native
      }
    }
  }
`;

interface Country {
  code: string;
  name: string;
  emoji: string;
  continent: { name: string };
  languages: Array<{ name: string; native: string }>;
}

interface CountryListResult {
  countries: Country[];
}

async function main(): Promise<void> {
  const data = await client.request<CountryListResult>(COUNTRIES_QUERY);
  const grouped = Map.groupBy(data.countries, (c) => c.continent.name);
  for (const [continent, countries] of grouped.entries()) {
    console.log(`\n${continent} (${countries.length} countries)`);
    for (const c of countries.slice(0, 3)) {
      console.log(`  ${c.emoji}  ${c.name} (${c.code})`);
    }
    if (countries.length > 3) {
      console.log(`  … and ${countries.length - 3} more`);
    }
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
