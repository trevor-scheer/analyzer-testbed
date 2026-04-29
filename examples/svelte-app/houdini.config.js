/** @type {import('houdini').ConfigFile} */
const config = {
  watchSchema: {
    url: "http://localhost:4000/graphql",
  },
  plugins: {
    "houdini-svelte": {},
  },
  // Point at the testbed schema for static analysis — houdini reads this for
  // type generation. At runtime, fetch is intercepted by MSW.
  schemaPath: "../../apps/web/graphql/*.graphql",
};

export default config;
