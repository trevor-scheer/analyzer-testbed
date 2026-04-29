import { getClient } from "@/lib/apollo/rsc-client";
import { TeamDetailDocument } from "@/graphql/generated/operations";
import { TeamEditClient } from "./TeamEditClient";
import { notFound } from "next/navigation";

export default async function TeamEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await getClient().query({
    query: TeamDetailDocument,
    variables: { id },
  });

  if (!data?.team) notFound();

  const initialSlots = data.team.slots.map((s: { pokemon: { id: string } }) => ({
    pokemonId: s.pokemon.id,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Team</h1>
      <TeamEditClient teamId={id} initialName={data.team.name} initialSlots={initialSlots} />
    </div>
  );
}
