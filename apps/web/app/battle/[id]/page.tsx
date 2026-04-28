import { getClient } from "@/lib/apollo/rsc-client";
import { gql } from "@apollo/client";
import { BattleField } from "@/components/battle/BattleField";
import { notFound } from "next/navigation";

const GET_BATTLE = gql`
  query BattleById($id: ID!) {
    battle(id: $id) {
      id
      status
      teamA {
        id
        slots {
          id
          pokemon {
            id
            name
          }
          moves {
            ... on PhysicalMove {
              id
              name
            }
            ... on SpecialMove {
              id
              name
            }
            ... on StatusMove {
              id
              name
            }
          }
        }
      }
    }
  }
`;

interface Move {
  id: string;
  name: string;
}

interface SlotData {
  id: string;
  pokemon: { id: string; name: string };
  moves: Move[];
}

interface BattleData {
  battle?: {
    id: string;
    status: string;
    teamA: { id: string; slots: SlotData[] };
  } | null;
}

export default async function BattlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data } = await getClient().query<BattleData>({
    query: GET_BATTLE,
    variables: { id },
  });

  if (!data?.battle) notFound();

  const firstSlot = data.battle.teamA.slots[0];
  const activePokemonMoves: Move[] =
    firstSlot?.moves?.map((m) => ({ id: m.id, name: m.name })) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Battle</h1>
      <BattleField battleId={id} activePokemonMoves={activePokemonMoves} />
    </div>
  );
}
