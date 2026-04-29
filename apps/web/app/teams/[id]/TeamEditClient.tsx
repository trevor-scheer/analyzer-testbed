"use client";

import { useRouter } from "next/navigation";
import { TeamBuilder, type SlotDraft } from "@/components/teams/TeamBuilder";

export function TeamEditClient({
  teamId,
  initialName,
  initialSlots,
}: {
  teamId: string;
  initialName: string;
  initialSlots: SlotDraft[];
}) {
  const router = useRouter();
  return (
    <TeamBuilder
      teamId={teamId}
      initialName={initialName}
      initialSlots={initialSlots}
      onSaved={() => router.push("/teams")}
    />
  );
}
