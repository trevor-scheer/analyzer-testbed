"use client";

import { useRouter } from "next/navigation";
import { TeamBuilder } from "@/components/teams/TeamBuilder";

export default function NewTeamPage() {
  const router = useRouter();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create Team</h1>
      <TeamBuilder onSaved={(id) => router.push(`/teams/${id}`)} />
    </div>
  );
}
